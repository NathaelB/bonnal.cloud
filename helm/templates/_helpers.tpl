{{/*
Expand the name of the chart.
*/}}
{{- define "bonnal-cloud.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "bonnal-cloud.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create a workload-specific full name.
Expected context: dict "root" $ "name" $name
*/}}
{{- define "bonnal-cloud.appFullname" -}}
{{- $root := .root -}}
{{- $name := .name -}}
{{- printf "%s-%s" (include "bonnal-cloud.fullname" $root) $name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "bonnal-cloud.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "bonnal-cloud.labels" -}}
helm.sh/chart: {{ include "bonnal-cloud.chart" . }}
{{ include "bonnal-cloud.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Common labels for a workload.
Expected context: dict "root" $ "name" $name
*/}}
{{- define "bonnal-cloud.appLabels" -}}
{{- $root := .root -}}
helm.sh/chart: {{ include "bonnal-cloud.chart" $root }}
{{ include "bonnal-cloud.appSelectorLabels" . }}
{{- if $root.Chart.AppVersion }}
app.kubernetes.io/version: {{ $root.Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ $root.Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "bonnal-cloud.selectorLabels" -}}
app.kubernetes.io/name: {{ include "bonnal-cloud.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Selector labels for a workload.
Expected context: dict "root" $ "name" $name
*/}}
{{- define "bonnal-cloud.appSelectorLabels" -}}
{{- $root := .root -}}
app.kubernetes.io/name: {{ include "bonnal-cloud.name" $root }}
app.kubernetes.io/instance: {{ $root.Release.Name }}
app.kubernetes.io/component: {{ .name }}
{{- end }}
