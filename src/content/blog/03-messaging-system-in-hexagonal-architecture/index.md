---
title: "Messaging System in Hexagonal Architecture in Rust"
summary: "Dans cet article, nous allons implémenter un système de messagerie simple en Rust en utilisant l'architecture hexagonale."
date: "Dec 12 2024"
draft: false
tags:
- Rust
- Architecture
- CloudNative
---

L’objectif de cet article est de présenter comment mettre en place un système de messagerie dans un service écrit en Rust, pour implémenter plusieurs solutions (NATS, RabbitMQ, Pub/Sub GCP).

Dans cette application, nous implémenterons différents patterns en Rust afin de pouvoir choisir l’implémentation au runtime, afin d’être totalement agnostique lors de la compilation.

---

## Rappel du principe de l’architecture hexagonale

Ce type d’architecture vise à rendre les applications indépendantes de leur interfaces utilisateur, bases de données, frameworks, ou systèmes externes. Elle est centrée sur le domaine métier et favorise la testabilité, la maintenabilité et l’évolutivité.

### Objectifs clés

- **Indépendance**: Le domaine métier ne dépend pas des services externes.
- **Facilité de test**: La séparation nette des responsabilités permet de tester la logique métier sans dépendance au systèmes externes.
- **Flexibilité et évolutivité**: Remplacer ou ajouter des interfaces devient plus simple.

### Structure de base

- **Domain**: Contient la logique métier (entités, services)
- **Application**: Interfaces définissant les interactions externes.
- **Infrastructure**: Implémentent les interfaces en se connectant aux systèmes externes.

--- 

## Définition du système de messagerie

Nous allons construire un service de messagerie d’envoyer et de recevoir des messages via différentes implémentations: NATS, Pub/Sub GCP.

### Concepts clés à implémenter

1. **Port entrant**: Interface définissant l’action d’envoi et de réception de messages.
2. **Port sortant**: Intefaces représentant les systèmes externes (NATS, Pub/Sub, …)
3. **Adaptateurs**: Modules concrets implémentant ces ports sortants.


## Architecture Rust

```rs
// application/ports/messaging.rs


pub trait MessagingPort: Clone + Send + Sync + 'static {
    fn publish_message(
        &self,
        topic: String,
        message: String,
    ) -> impl Future<Output = anyhow::Result<()>> + Send;
    fn subscribe<F, T, Fut>(
        &self,
        topic: &str,
        handler: F,
    ) -> impl Future<Output = anyhow::Result<()>> + Send
    where
        F: Fn(T) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = anyhow::Result<()>> + Send + 'static,
        T: DeserializeOwned + Send + Sync + Debug + Clone + 'static;
}
```

Ici nous venons de déclarer un trait qui devra être implémenté par les différentes implémentation pour respecter nos contrats.


### Adapter pour NATS

```rs
#[derive(Clone)]
pub struct Nats {
    connection: Arc<Client>,
}

impl Nats {
    pub async fn new(addrs: &str) -> anyhow::Result<Nats> {
        let client = async_nats::connect(addrs).await?;

        Ok(Nats {
            connection: Arc::new(client),
        })
    }

    pub fn get_connection(&self) -> Arc<Client> {
        Arc::clone(&self.connection)
    }
}
```

En premier lieu, on créer notre struct Nats afin de créer une connection et récupérer sa connection.


```rs
impl MessagingPort for Nats {
    async fn publish_message(&self, topic: String, message: String) -> anyhow::Result<()> {
        let conn = self.get_connection();

        conn.publish(topic, message.into())
            .await
            .map_err(|e| anyhow::anyhow!(e.to_string()))
            .map(|_| ())
    }
    async fn subscribe<F, T, Fut>(&self, topic: &str, handler: F) -> anyhow::Result<()>
    where
        F: Fn(T) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = anyhow::Result<()>> + Send + 'static,
        T: DeserializeOwned + Send + Sync + Debug + 'static,
    {
        let conn = self.get_connection();

        let t = String::from(topic);

        let mut subscriber = conn
            .subscribe(t)
            .await
            .map_err(|e| anyhow::anyhow!(e.to_string()))?;

        tokio::spawn(async move {
            while let Some(message) = subscriber.next().await {
                let message_str = String::from_utf8_lossy(&message.payload).to_string();

                let parsed_message: T = match serde_json::from_str(&message_str) {
                    Ok(msg) => msg,
                    Err(e) => {
                        tracing::error!("Failed to parse message: {:?}", e);
                        continue;
                    }
                };

                if let Err(e) = handler(parsed_message).await {
                    tracing::error!("Failed to handle message: {:?}", e);
                }
            }
        });

        Ok(())
    }
}
```

Désormais notre struct `Nats` implémente correctement le trait `MessagingPort`

On peut faire l’implémentation de PubSub, exemple:

```rs
#[derive(Clone)]
pub struct PubSubMessaging {
    client: Arc<Client>,
    project_id: String,
}

impl PubSubMessaging {
    pub async fn new(project_id: String) -> Result<Self> {
        let config = ClientConfig::default().with_auth().await?;
        let client = Client::new(config).await?;

        Ok(PubSubMessaging {
            client: Arc::new(client),
            project_id,
        })
    }
}

impl MessagingPort for PubSubMessaging {
    async fn publish_message(&self, topic: String, message: String) -> Result<()> {
        let t = format!("projects/{}/topics/{}", self.project_id, topic);
        let topic = self.client.topic(&t);

        if !topic.exists(None).await? {
            tracing::error!("Topic does not exist");
        }

        let publisher = topic.new_publisher(None);

        let msg = PubsubMessage {
            data: message.into(),
            ordering_key: "order".into(),
            ..Default::default()
        };

        let awaiter = publisher.publish(msg).await;

        awaiter.get().await?;

        Ok(())
    }

    async fn subscribe<F, T, Fut>(&self, queue: &str, handler: F) -> Result<()>
    where
        F: Fn(T) -> Fut + Send + Sync + 'static,
        Fut: std::future::Future<Output = Result<()>> + Send + 'static,
        T: serde::de::DeserializeOwned + Send + Sync + std::fmt::Debug + 'static,
    {
        let _topic = self.client.topic(queue);

        let _config = SubscriptionConfig {
            enable_message_ordering: true,
            ..Default::default()
        };

        let t = format!("projects/nathael-dev/topics/{}", queue);

        let subscription = self.client.subscription(&t);
        let mut stream = subscription.subscribe(None).await?;

        tokio::spawn(async move {
            while let Some(message) = stream.next().await {
                let msg: Vec<u8> = message.message.data.clone();
                let msg = match String::from_utf8(msg) {
                    Ok(s) => s,
                    Err(e) => {
                        tracing::error!("Failed to parse message payload: {:?}", e);
                        continue;
                    }
                };

                let parsed_message: T = match serde_json::from_str(&msg) {
                    Ok(msg) => msg,
                    Err(e) => {
                        tracing::error!("Failed to parse message: {:?}", e);
                        continue;
                    }
                };

                if let Err(e) = handler(parsed_message).await {
                    tracing::error!("Failed to handle message: {:?}", e);
                }
            }
        });

        Ok(())
    }
}
```

---

## Sélection au Runtime

### Configuration et Injection de dépendances

```rs
#[derive(Debug, Clone, Default)]
pub enum MessagingType {
    PubSub,
    #[default]
    Nats,
}

impl ValueEnum for MessagingType {
    fn value_variants<'a>() -> &'a [Self] {
        &[MessagingType::PubSub, MessagingType::Nats]
    }

    fn from_str(input: &str, _ignore_case: bool) -> std::result::Result<Self, String> {
        match input {
            "pubsub" => Ok(MessagingType::PubSub),
            "nats" => Ok(MessagingType::Nats),
            _ => Err("Invalid messaging type".to_string()),
        }
    }

    fn to_possible_value(&self) -> Option<PossibleValue> {
        match self {
            MessagingType::PubSub => Some(PossibleValue::new("pubsub")),
            MessagingType::Nats => Some(PossibleValue::new("nats")),
        }
    }
}

#[derive(Clone)]
pub enum MessagingTypeImpl {
    PubSub(PubSubMessaging),
    Nats(Nats),
}

impl Debug for MessagingTypeImpl {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            MessagingTypeImpl::PubSub(_) => write!(f, "PubSub"),
            MessagingTypeImpl::Nats(_) => write!(f, "Nats"),
        }
    }
}

impl MessagingTypeImpl {
    pub async fn new(typ: &MessagingType, env: Arc<Env>) -> Result<Self> {
        match typ {
            MessagingType::PubSub => {
                let project_id = env.google_project_id.clone().unwrap_or_default();

                let messaging = PubSubMessaging::new(project_id).await?;
                Ok(MessagingTypeImpl::PubSub(messaging))
            }
            MessagingType::Nats => {
                let nats_url = env.nats_url.clone().unwrap_or_default();
                let messaging = Nats::new(&nats_url).await?;
                Ok(MessagingTypeImpl::Nats(messaging))
            }
        }
    }
}

impl MessagingPort for MessagingTypeImpl {
    async fn publish_message(&self, topic: String, message: String) -> Result<()> {
        match self {
            MessagingTypeImpl::PubSub(messaging) => messaging.publish_message(topic, message).await,
            MessagingTypeImpl::Nats(messaging) => messaging.publish_message(topic, message).await,
        }
    }

    async fn subscribe<F, T, Fut>(&self, topic: &str, handler: F) -> Result<()>
    where
        F: Fn(T) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = Result<()>> + Send + 'static,
        T: DeserializeOwned + Send + Sync + Debug + Clone + 'static,
    {
        println!("Type of messaging: {:?}", self);
        match self {
            MessagingTypeImpl::PubSub(messaging) => messaging.subscribe(topic, handler).await,
            MessagingTypeImpl::Nats(messaging) => messaging.subscribe(topic, handler).await,
        }
    }
}
```

### Pourquoi utiliser une enum `MessagingType` et `MessagingTypeImpl` ?

Dans Rust, chaque type doit avoir une taille connue au moment de la compilation. Pour éviter d’utiliser des traits dynamiques `dyn Trait` ou des `Box`, nous avons définis deux enums complémentaires:

1. `MessagingType`: Une enum simple pour représenter les types de messagerie supportés. Elle est utilisée pour la configuration initiale.
2. `MessagingTypeImpl`: Une enum contenant les implémentations concrètes. Chaque variante contient un type spécifique (comme `PubSubMessaging` ou `Nats`).

Cette approche permet de :

- Sélectionner dynamiquement l’implémentation de messagerie sans dépendre de `Box<dyn Trait>`.
- Conserver une structure statique et optimisée, puisque Rust connaît la taille maximale possible de `MessagingTypeImpl`


### Utilisation dans votre main avec Clap

```rs
#[derive(Debug, Clone, Default, Parser)]
pub struct Env {
    #[clap(env)]
    pub port: String,

    #[clap(env)]
    pub messaging_type: MessagingType,

    #[clap(env)]
    pub database_host: String,
    #[clap(env)]
    pub database_user: String,
    #[clap(env)]
    pub database_password: String,

    #[clap(env)]
    pub nats_url: Option<String>,

    #[clap(env)]
    pub google_project_id: Option<String>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok();
    tracing_subscriber::fmt::init();

    let env = Arc::new(Env::parse());

    let postgres = Arc::new(Postgres::new(Arc::clone(&env)).await?);

    let messaging_port =
        Arc::new(MessagingTypeImpl::new(&env.messaging_type, Arc::clone(&env)).await?);

    let server_repository = PostgresServerRepository::new(Arc::clone(&postgres));
    let server_service = Arc::new(ServerServiceImpl::new(
        server_repository,
        Arc::clone(&messaging_port),
    ));

    start_subscriptions(Arc::clone(&messaging_port), Arc::clone(&server_service)).await?;

    let server_config = HttpServerConfig::new(env.port.clone());
    let http_server = HttpServer::new(server_config, Arc::clone(&server_service)).await?;

    http_server.run().await
}
```


### Bonus: start subscriptions

```rs
pub async fn start_subscriptions<S>(
    messaging: Arc<MessagingTypeImpl>,
    server_service: Arc<S>,
) -> Result<()>
where
    S: ServerService,
{
    let messaging = Arc::clone(&messaging);

    messaging
        .subscribe("server_creation_responses", {
            let server_service = Arc::clone(&server_service);
            move |message: ServerCreationResponse| {
                let server_service = Arc::clone(&server_service);
                async move {
                    server_service.handle_server_created(message).await?;
                    Ok(())
                }
            }
        })
        .await?;

    Ok(())
}
```



---

## Conclusion

En utilisant cette approche basée sur deux enums, nous restons dans les contraintes de compilation strictes de Rust sans recouvrir à des traits dynamiques. Cela garantit une exécution efficace et permet de choisir l’implémentation à partir de la configuration de l’environnement.

