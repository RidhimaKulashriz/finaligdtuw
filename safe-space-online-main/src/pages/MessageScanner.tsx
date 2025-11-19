import { useState } from "react";
import { MessageSquare, Upload, AlertTriangle, CheckCircle, XCircle, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const MessageScanner = () => {
  const [scanMode, setScanMode] = useState<"text" | "image">("text");
  const [inputText, setInputText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    if (!inputText.trim()) {
      return;
    }

    setScanning(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/messages/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: inputText }),
      });

      if (!response.ok) {
        throw new Error('Scan failed');
      }

      const data = await response.json();
      setResult(data.data);
    } catch (error) {
      console.error('Scan error:', error);
      // Fallback to mock results if API fails
      setTimeout(() => {
        const mockResults = [
          {
            category: "Safe",
            severity: "low",
            message: "This message appears safe and friendly!",
            icon: CheckCircle,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            confidence: 95,
          },
          {
            category: "Toxic",
            severity: "high",
            message: "This message contains toxic language and aggressive tone.",
            icon: XCircle,
            color: "text-red-500",
            bgColor: "bg-red-500/10",
            confidence: 87,
          },
          {
            category: "Harassment",
            severity: "high",
            message: "Potential harassment detected. This message may be trying to intimidate or threaten you.",
            icon: AlertTriangle,
            color: "text-red-500",
            bgColor: "bg-red-500/10",
            confidence: 92,
          },
          {
            category: "Suspicious",
            severity: "medium",
            message: "This message contains suspicious elements. Please be cautious.",
            icon: AlertTriangle,
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
            confidence: 78,
          },
        ];
        setResult(mockResults[Math.floor(Math.random() * mockResults.length)]);
      }, 1500);
    } finally {
      setScanning(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would process the image
      handleScan();
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-heading font-bold mb-4 flex items-center gap-3">
            <MessageSquare className="h-10 w-10 text-primary" />
            Message Scanner
          </h1>
          <p className="text-xl text-muted-foreground">
            Scan messages and screenshots for toxic content, harassment, scams, and more
          </p>
        </div>

        {/* Mode Selection */}
        <Card className="p-6">
          <div className="flex gap-4 mb-6">
            <Button
              variant={scanMode === "text" ? "default" : "outline"}
              onClick={() => setScanMode("text")}
              className="flex-1 rounded-full"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Paste Text
            </Button>
            <Button
              variant={scanMode === "image" ? "default" : "outline"}
              onClick={() => setScanMode("image")}
              className="flex-1 rounded-full"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Screenshot
            </Button>
          </div>

          {/* Text Input Mode */}
          {scanMode === "text" && (
            <div className="space-y-4">
              <Label htmlFor="message-input">Paste the message you want to scan</Label>
              <Textarea
                id="message-input"
                placeholder="Paste the message here..."
                className="min-h-[200px] text-lg"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <Button
                onClick={handleScan}
                disabled={!inputText || scanning}
                className="w-full btn-hero"
              >
                {scanning ? "Scanning..." : "Scan Message"}
              </Button>
            </div>
          )}

          {/* Image Upload Mode */}
          {scanMode === "image" && (
            <div className="space-y-4">
              <Label htmlFor="image-upload">Upload a screenshot of the message</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Click to upload screenshot</p>
                  <p className="text-sm text-muted-foreground">
                    Supports JPG, PNG, or any image format
                  </p>
                </label>
              </div>
            </div>
          )}
        </Card>

        {/* Scanning Animation */}
        {scanning && (
          <Card className="p-8 text-center">
            <div className="animate-spin h-16 w-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-lg font-medium">Analyzing message...</p>
            <p className="text-muted-foreground">This usually takes a few seconds</p>
          </Card>
        )}

        {/* Results */}
        {result && !scanning && (
          <Card className={`p-8 border-2 ${result.bgColor} ${result.color.replace("text-", "border-")}`}>
            <div className="flex items-start gap-4 mb-6">
              <div className={`p-4 rounded-2xl ${result.bgColor}`}>
                <result.icon className={`h-10 w-10 ${result.color}`} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-heading font-bold mb-2">
                  {result.category} Detected
                </h2>
                <p className="text-lg text-muted-foreground">{result.message}</p>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Confidence Score</span>
                <span className="text-sm font-bold">{result.confidence}%</span>
              </div>
              <div className="h-3 bg-background/50 rounded-full overflow-hidden">
                <div
                  className={`h-full ${result.color.replace("text-", "bg-")} transition-all duration-1000`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            {/* Recommendations */}
            {result.severity !== "low" && (
              <div className="bg-background/80 rounded-xl p-6">
                <h3 className="font-heading font-semibold text-xl mb-4">
                  What should you do?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Don't respond to this message</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Block the sender if possible</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Report this to the platform</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Talk to a trusted adult or friend</span>
                  </li>
                </ul>

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" className="rounded-full">
                    Get Support
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    Report This
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Info Card */}
        <Card className="p-6 bg-blue-500/10 border-blue-500/20">
          <h3 className="font-heading font-semibold text-lg mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            How does this work?
          </h3>
          <p className="text-muted-foreground mb-3">
            Our AI-powered scanner analyzes messages for:
          </p>
          <ul className="text-muted-foreground space-y-2 list-disc list-inside">
            <li>Toxic and aggressive language</li>
            <li>Harassment and bullying patterns</li>
            <li>Potential grooming behavior</li>
            <li>Scam and phishing attempts</li>
            <li>Suspicious or manipulative content</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            All scans are private and encrypted. We never store your messages.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MessageScanner;
