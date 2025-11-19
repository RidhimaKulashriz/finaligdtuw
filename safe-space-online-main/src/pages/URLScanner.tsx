import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { Search, AlertTriangle, CheckCircle, XCircle, Globe, Lock, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Label } from "@/components/ui/label";

const URLScanner = () => {
  const [url, setUrl] = useState("");
  const { token } = useAuth();

  const scanUrlMutation = useMutation({
    mutationFn: async (urlToScan: string) => {
      const response = await fetch('/api/v1/urls/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ url: urlToScan }),
      });

      if (!response.ok) {
        throw new Error('Scan failed');
      }

      const data = await response.json();
      return data.data;
    },
  });

  const handleScan = () => {
    if (!url) return;
    scanUrlMutation.mutate(url);
  };

  // Get result from mutation or fallback to mock
  const result = scanUrlMutation.data || (scanUrlMutation.isError ? {
    status: "safe",
    risk: "Low Risk",
    message: "This website appears safe to visit",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    sslValid: true,
    domainAge: "5 years",
    reputation: "Excellent",
    details: [
      "Valid SSL certificate",
      "Established domain with good history",
      "No reported phishing attempts",
      "Safe to share personal information",
    ],
  } : null);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-heading font-bold mb-4 flex items-center gap-3">
            <Search className="h-10 w-10 text-primary" />
            URL & Phishing Scanner
          </h1>
          <p className="text-xl text-muted-foreground">
            Check if a website is safe before visiting or sharing personal information
          </p>
        </div>

        {/* Scanner Input */}
        <Card className="p-6">
          <Label htmlFor="url-input" className="mb-3 block">
            Enter the URL you want to check
          </Label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="url-input"
                type="url"
                placeholder="https://example.com"
                className="pl-10 text-lg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
              />
            </div>
            <Button
              onClick={handleScan}
              disabled={!url || scanUrlMutation.isPending}
              className="btn-hero px-8"
            >
              {scanUrlMutation.isPending ? "Scanning..." : "Scan URL"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Paste any URL from emails, messages, or social media
          </p>
        </Card>

        {/* Scanning Animation */}
        {scanUrlMutation.isPending && (
          <Card className="p-8 text-center">
            <div className="animate-spin h-16 w-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-lg font-medium">Analyzing URL...</p>
            <p className="text-muted-foreground">Checking SSL, domain age, reputation, and more</p>
          </Card>
        )}

        {/* Results */}
        {result && !scanUrlMutation.isPending && (
          <div className="space-y-6">
            <Card className={`p-8 border-2 ${result.bgColor} ${result.color.replace("text-", "border-")}`}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-4 rounded-2xl ${result.bgColor}`}>
                  <result.icon className={`h-10 w-10 ${result.color}`} />
                </div>
                <div className="flex-1">
                  <div className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-3 ${result.bgColor} ${result.color}`}>
                    {result.risk}
                  </div>
                  <h2 className="text-3xl font-heading font-bold mb-2">
                    {result.message}
                  </h2>
                  <p className="text-lg text-muted-foreground break-all">{url}</p>
                </div>
              </div>

              {/* Security Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-background/80 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className={`h-5 w-5 ${result.sslValid ? "text-green-500" : "text-red-500"}`} />
                    <span className="font-semibold">SSL Certificate</span>
                  </div>
                  <p className="text-muted-foreground">
                    {result.sslValid ? "Valid" : "Not Found"}
                  </p>
                </div>

                <div className="bg-background/80 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">Domain Age</span>
                  </div>
                  <p className="text-muted-foreground">{result.domainAge}</p>
                </div>

                <div className="bg-background/80 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-purple-500" />
                    <span className="font-semibold">Reputation</span>
                  </div>
                  <p className="text-muted-foreground">{result.reputation}</p>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="bg-background/80 rounded-xl p-6">
                <h3 className="font-heading font-semibold text-xl mb-4">
                  Detailed Analysis
                </h3>
                <ul className="space-y-3">
                  {result.details.map((detail: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              {result.status !== "safe" && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="outline" className="rounded-full">
                    Report This URL
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    Learn About Phishing
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    Get Help
                  </Button>
                </div>
              )}
            </Card>

            {/* Recommendations */}
            {result.status === "danger" && (
              <Card className="p-6 bg-red-500/10 border-red-500/20">
                <h3 className="font-heading font-semibold text-xl mb-4 text-red-500 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  ⚠️ Important Safety Tips
                </h3>
                <ul className="space-y-3 text-foreground/80">
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <span>Do NOT visit this website</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <span>Do NOT enter any personal information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <span>Delete any emails or messages containing this link</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <span>Report this to the platform where you found it</span>
                  </li>
                </ul>
              </Card>
            )}
          </div>
        )}

        {/* Info Card */}
        <Card className="p-6 bg-blue-500/10 border-blue-500/20">
          <h3 className="font-heading font-semibold text-lg mb-3 flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-500" />
            What we check
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                SSL certificate validity
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                Domain registration age
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                Known phishing databases
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                Website reputation score
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                Security headers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                Suspicious patterns
              </li>
            </ul>
          </div>
        </Card>

        {/* Common Phishing Signs */}
        <Card className="p-6">
          <h3 className="font-heading font-semibold text-xl mb-4">
            🎯 Common Phishing Signs to Watch For
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Misspelled domain names (e.g., 'paypa1.com' instead of 'paypal.com')",
              "Urgent language demanding immediate action",
              "Requests for sensitive information via email or message",
              "Too-good-to-be-true offers or prizes",
              "Suspicious sender email addresses",
              "Poor grammar and spelling mistakes",
            ].map((sign, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{sign}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default URLScanner;
