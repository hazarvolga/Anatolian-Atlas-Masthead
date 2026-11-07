"use client";


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api/client";

const PROVIDERS = [
  {
    id: "openai",
    label: "OpenAI",
    models: [
      { id: "gpt-4o", label: "GPT-4o", paid: true },
      { id: "gpt-4-turbo", label: "GPT-4 Turbo", paid: true },
      { id: "gpt-4", label: "GPT-4", paid: true },
      { id: "gpt-4-32k", label: "GPT-4 32K", paid: true },
      { id: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", paid: false },
      { id: "gpt-3.5-turbo-16k", label: "GPT-3.5 Turbo 16K", paid: false },
      { id: "gpt-3.5", label: "GPT-3.5", paid: false },
      { id: "gpt-3", label: "GPT-3", paid: false },
    ],
    apiGuide: "https://platform.openai.com/api-keys",
  },
  {
    id: "perplexity",
    label: "Perplexity AI",
    models: [
      { id: "llama-3-70b-instruct", label: "Llama 3 70B Instruct", paid: false },
      { id: "llama-3-8b-instruct", label: "Llama 3 8B Instruct", paid: false },
      { id: "sonar-small", label: "Sonar Small", paid: false },
      { id: "sonar-large", label: "Sonar Large", paid: true },
      { id: "mistral-7b-instruct", label: "Mistral 7B Instruct", paid: false },
      { id: "mixtral-8x7b-instruct", label: "Mixtral 8x7B Instruct", paid: false },
      { id: "codellama-70b-instruct", label: "Code Llama 70B Instruct", paid: false },
    ],
    apiGuide: "https://www.perplexity.ai/developer/api-keys",
  },
  {
    id: "anthropic",
    label: "Anthropic",
    models: [
      { id: "claude-3-opus-20240229", label: "Claude 3 Opus (Feb 2024)", paid: true },
      { id: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet (Feb 2024)", paid: false },
      { id: "claude-3-haiku-20240307", label: "Claude 3 Haiku (Mar 2024)", paid: false },
      { id: "claude-2.1", label: "Claude 2.1", paid: false },
      { id: "claude-instant-1.2", label: "Claude Instant 1.2", paid: false },
    ],
    apiGuide: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "google",
    label: "Gemini (Google)",
    models: [
      { id: "gemini-1.5-flash-latest", label: "Gemini 1.5 Flash (Latest)", paid: false },
      { id: "gemini-1.5-pro-latest", label: "Gemini 1.5 Pro (Latest)", paid: true },
      { id: "gemini-1.0-pro", label: "Gemini 1.0 Pro", paid: false },
      { id: "gemini-pro-vision", label: "Gemini Pro Vision", paid: true },
      { id: "gemini-ultra", label: "Gemini Ultra", paid: true },
    ],
    apiGuide: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    models: [
      { id: "deepseek-v3-0324", label: "DeepSeek V3 0324 (Free)", paid: false },
      { id: "deepseek-coder-v2-6.7b", label: "DeepSeek Coder V2 6.7B", paid: false },
      { id: "deepseek-coder-v2-33b", label: "DeepSeek Coder V2 33B", paid: false },
      { id: "deepseek-coder", label: "DeepSeek Coder", paid: false },
      { id: "deepseek-llm", label: "DeepSeek LLM", paid: true },
    ],
    apiGuide: "https://platform.deepseek.com/api-keys",
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    models: [
      { id: "openrouter/llama-3-70b", label: "Llama 3 70B", paid: false },
      { id: "openrouter/mistral-large", label: "Mistral Large", paid: true },
      { id: "openrouter/mixtral-8x22b", label: "Mixtral 8x22B", paid: true },
      { id: "openrouter/gpt-4o", label: "GPT-4o (OpenRouter)", paid: true },
      { id: "openrouter/claude-3-opus", label: "Claude 3 Opus (OpenRouter)", paid: true },
      { id: "openrouter/yi-34b", label: "Yi-34B", paid: false },
      { id: "openrouter/qwen-110b", label: "Qwen 110B", paid: false },
      { id: "openrouter/deepseek-v3-0324", label: "DeepSeek V3 0324 (OpenRouter)", paid: false },
    ],
    apiGuide: "https://openrouter.ai/keys",
  },
  {
    id: "custom",
    label: "Custom Provider",
    models: [],
    apiGuide: "",
  },
];

export default function AISettings() {
  const [provider, setProvider] = useState(PROVIDERS[0].id);
  const [model, setModel] = useState(PROVIDERS[0].models[0]?.id || "");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [customModel, setCustomModel] = useState("");
  const { user } = useAuth();
  const [hasSavedApiKey, setHasSavedApiKey] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      if (!user) return;
      setLoading(true);
      try {
        const { data } = await api.get("/api/admin/settings/ai");
        if (data) {
          setProvider(data.provider || PROVIDERS[0].id);
          setModel(data.model || PROVIDERS[0].models[0]?.id || "");
          setCustomEndpoint(data.custom_endpoint || "");
          setCustomModel(data.custom_model || "");
          setHasSavedApiKey(!!data.api_key);
        }
      } catch (error) {
        console.error("Error fetching AI settings:", error);
      } finally {
        setLoading(false);
        setInitialLoaded(true);
      }
    }
    fetchSettings();
  }, [user]);

  const saveApiKey = async () => {
    setLoading(true);
    try {
      await api.post("/api/admin/settings/ai", {
        provider,
        model,
        apiKey,
        customEndpoint,
        customModel,
      });
      toast.success("AI settings saved successfully.");
      setHasSavedApiKey(!!apiKey); // Update UI to reflect saved key
      setApiKey(""); // Clear API key from input
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save AI settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (value: string) => {
    setProvider(value);
    const selectedProvider = PROVIDERS.find((p) => p.id === value);
    setModel(selectedProvider?.models[0]?.id || "");
    setApiKey("");
    setTestResult(null);
    setCustomEndpoint("");
    setCustomModel("");
  };

  const handleModelChange = (value: string) => {
    setModel(value);
    setTestResult(null);
  };

  const selectedProvider = PROVIDERS.find((p) => p.id === provider);
  const selectedModelObj = selectedProvider?.models.find((m) => m.id === model);
  const isPaidModel = !!selectedModelObj?.paid;
  const freeModels = selectedProvider?.models.filter(m => !m.paid).map(m => m.label).join(", ");

  const testAI = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const body: Record<string, any> = {
        message: "Merhaba, bu bir AI testi!",
        provider,
        model,
        apiKey: apiKey || undefined,
      };
      if (provider === "custom") {
        body.customEndpoint = customEndpoint;
        body.customModel = customModel;
      }
      const { data } = await api.post("/api/admin/ai/test", body);
      setTestResult(data?.reply ?? "");
    } catch (err: any) {
      setTestResult(err.response?.data?.error || err.message || "Test sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (!initialLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Yapay Zeka API Ayarları</CardTitle>
          <CardDescription>
            Yönetim panelinizde hangi AI sağlayıcılarını kullanacağınızı seçin ve yapılandırın.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-xs text-muted-foreground">
                {hasSavedApiKey ? (
                  <span className="text-green-700 font-semibold">Bir API anahtarınız kayıtlı.</span>
                ) : (
                  <span className="text-red-500">Kayıtlı API anahtarınız yok.</span>
                )}
              </span>
              <span className="text-xs text-muted-foreground">
                <b>Mevcut sağlayıcı:</b> {provider} &nbsp; <b>Model:</b> {model || "-"}
              </span>
            </div>
          </div>
          <div>
            <Label htmlFor="ai-provider">Yapay Zeka Sağlayıcı</Label>
            <Select value={provider} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-full" id="ai-provider">
                <SelectValue placeholder="Sağlayıcı seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {provider !== "custom" && (
            <div>
              <Label htmlFor="model">Model</Label>
              <Select value={model} onValueChange={handleModelChange}>
                <SelectTrigger className="w-full" id="model">
                  <SelectValue placeholder="Model seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProvider?.models.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.label}
                      <Badge variant={m.paid ? "destructive" : "default"} className="ml-1">
                        {m.paid ? "Ücretli" : "Ücretsiz"}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {provider === "custom" && (
            <div className="grid gap-2">
              <Label htmlFor="custom-endpoint">API Endpoint</Label>
              <Input
                type="text"
                id="custom-endpoint"
                placeholder="Örn: https://api.mycompanyai.com/v1/chat"
                value={customEndpoint}
                onChange={e => setCustomEndpoint(e.target.value)}
                className="w-full"
                disabled={loading}
                autoComplete="off"
              />
              <Label htmlFor="custom-model">Model Adı</Label>
              <Input
                type="text"
                id="custom-model"
                placeholder="Örn: turbo-01 veya GPT-neo"
                value={customModel}
                onChange={e => setCustomModel(e.target.value)}
                className="w-full"
                disabled={loading}
                autoComplete="off"
              />
            </div>
          )}
          <div>
            <Label htmlFor="apiKey">API Anahtarı</Label>
            <Input
              type="password"
              placeholder={hasSavedApiKey ? "API anahtarınızı yenilemek için yeniden girin" : "API Keyinizi girin"}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full"
              disabled={loading}
              id="apiKey"
              autoComplete="off"
            />
            {selectedProvider?.apiGuide && (
              <span className="text-xs text-muted-foreground">
                API anahtarınızı <a href={selectedProvider.apiGuide} target="_blank" className="underline text-blue-700">buradan</a> alabilirsiniz.
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={saveApiKey} disabled={loading || !provider || (!apiKey && !hasSavedApiKey)}>
              {hasSavedApiKey ? "Kaydı Güncelle" : "API Anahtarını Kaydet"}
            </Button>
            <Button onClick={testAI} variant="outline" disabled={loading || (!apiKey && !hasSavedApiKey)}>
              Yapay Zekayı Test Et
            </Button>
          </div>
          {testResult && (
            <div className="border rounded p-3 text-sm bg-muted">{testResult}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
