"use client"

import React, { useEffect, useState } from "react"
import { CheckCircle2, Copy, Terminal, Server, Cpu, ShieldCheck } from "lucide-react"

interface ScriptTab {
  name: string
  command: string
  logs: string[]
  meta: string
}

const TABS: ScriptTab[] = [
  {
    name: "deploy.sh",
    command: "az aks get-credentials -g rg-prod -n aks-cluster && kubectl apply -k ./k8s/prod",
    logs: [
      "✓ Authenticated to Azure Kubernetes Service (AZ-104)",
      "✓ Namespace 'prod-workloads' created/configured",
      "✓ Deployment updated: 3 replicas healthy & ready",
      "✓ Ingress TLS certificate provisioned via Let's Encrypt",
    ],
    meta: "AKS Cluster • EU-West",
  },
  {
    name: "main.tf",
    command: "terraform apply -auto-approve tfplan",
    logs: [
      "✓ azurerm_resource_group.rg_prod: Created (ID: /subscriptions/04...)",
      "✓ azurerm_virtual_network.vnet: Provisioned with /16 subnet",
      "✓ azurerm_kubernetes_cluster.aks: 2 system nodes + 3 user nodes",
      "✓ Apply complete! Resources: 14 added, 0 changed, 0 destroyed.",
    ],
    meta: "IaC Automation • Terraform",
  },
  {
    name: "ci-cd.yaml",
    command: "gh workflow run devsecops-pipeline.yml --ref main",
    logs: [
      "✓ SonarQube static code scan: 0 Vulnerabilities, Grade A",
      "✓ Trivy container vulnerability scan: PASSED (0 Critical)",
      "✓ Docker build & push to ACR (azurecr.io/app:v1.4.2)",
      "✓ ArgoCD synchronized release to production cluster",
    ],
    meta: "GitHub Actions • DevSecOps",
  },
]

export default function TypingTerminal({
  className,
}: {
  commands?: string[]
  typingSpeed?: number
  pauseMs?: number
  className?: string
}) {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const [typedChars, setTypedChars] = useState(0)
  const currentTab = TABS[activeTab]

  useEffect(() => {
    setTypedChars(0)
    let index = 0
    const targetLength = currentTab.command.length
    const interval = window.setInterval(() => {
      index++
      setTypedChars(index)
      if (index >= targetLength) {
        clearInterval(interval)
      }
    }, 28)

    return () => clearInterval(interval)
  }, [activeTab, currentTab.command])

  const copyCommand = () => {
    navigator.clipboard.writeText(currentTab.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0e12]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-all duration-300 hover:border-primary/30 hover:shadow-[0_30px_90px_rgba(229,178,93,0.15)] " +
        (className || "")
      }
    >
      {/* Top Window Bar */}
      <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#ff5f56]/80 transition-opacity hover:opacity-100" />
          <span className="size-3 rounded-full bg-[#ffbd2e]/80 transition-opacity hover:opacity-100" />
          <span className="size-3 rounded-full bg-[#27c93f]/80 transition-opacity hover:opacity-100" />
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1">
          {TABS.map((tab, idx) => (
            <button
              key={tab.name}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-colors ${
                activeTab === idx
                  ? "bg-primary/20 text-primary font-medium"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={copyCommand}
          aria-label="Copy Command"
          className="rounded-md p-1 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
        >
          {copied ? (
            <CheckCircle2 className="size-3.5 text-primary" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>

      {/* Terminal Body */}
      <div className="p-5 font-mono text-xs">
        {/* Command Line */}
        <div className="flex items-start gap-2">
          <span className="text-primary font-bold select-none">$</span>
          <p className="flex-1 text-foreground/90 font-medium leading-relaxed break-all">
            {currentTab.command.slice(0, typedChars)}
            <span className="inline-block h-3.5 w-1.5 ml-1 bg-primary align-middle animate-pulse" />
          </p>
        </div>

        {/* Live Output Stream */}
        <div className="mt-4 space-y-2 border-t border-white/6 pt-4">
          {currentTab.logs.map((log, i) => (
            <div
              key={log}
              className="flex items-center gap-2 text-muted-foreground/90 text-[11px] transition-all duration-300"
              style={{
                opacity: typedChars >= currentTab.command.length * 0.4 ? 1 : 0.2,
                transform:
                  typedChars >= currentTab.command.length * 0.4
                    ? "translateX(0)"
                    : "translateX(-4px)",
                transitionDelay: `${i * 90}ms`,
              }}
            >
              <span className="size-1.5 rounded-full bg-primary/70" />
              <span>{log}</span>
            </div>
          ))}
        </div>

        {/* Bottom Cluster Status Bar */}
        <div className="mt-5 flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-[11px] text-muted-foreground ring-1 ring-white/5">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="font-semibold text-foreground/80">{currentTab.meta}</span>
          </div>
          <span className="font-medium text-primary">Status: Healthy</span>
        </div>
      </div>
    </div>
  )
}
