import { useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Download, Award } from "lucide-react";

interface CertificateGeneratorProps {
  volunteerName: string;
  campTitle: string;
  campDate: string;
  hoursServed: number;
  role?: string;
  college?: string;
}

export function CertificateGenerator({
  volunteerName,
  campTitle,
  campDate,
  hoursServed,
  role = "Volunteer",
  college,
}: CertificateGeneratorProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (certificateRef.current) {
      // In a real implementation, you'd use html2canvas or jsPDF
      // For now, we'll trigger a print dialog
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Certificate of Participation - ${volunteerName}</title>
              <style>
                body {
                  font-family: 'Georgia', serif;
                  margin: 0;
                  padding: 40px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  background: #f5f5f5;
                }
                .certificate {
                  width: 800px;
                  padding: 60px;
                  background: white;
                  border: 20px solid #E63946;
                  border-radius: 10px;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                  position: relative;
                }
                .certificate::before {
                  content: '';
                  position: absolute;
                  top: 40px;
                  left: 40px;
                  right: 40px;
                  bottom: 40px;
                  border: 2px solid #0077B6;
                  border-radius: 5px;
                }
                .header {
                  text-align: center;
                  margin-bottom: 40px;
                }
                .logo {
                  font-size: 48px;
                  color: #E63946;
                  margin-bottom: 10px;
                }
                .title {
                  font-size: 42px;
                  color: #1a1a1a;
                  margin: 20px 0;
                  font-weight: bold;
                }
                .subtitle {
                  font-size: 20px;
                  color: #0077B6;
                  margin-bottom: 40px;
                }
                .content {
                  text-align: center;
                  margin: 40px 0;
                  line-height: 2;
                }
                .recipient {
                  font-size: 36px;
                  color: #E63946;
                  font-weight: bold;
                  margin: 20px 0;
                  border-bottom: 2px solid #E63946;
                  display: inline-block;
                  padding-bottom: 5px;
                }
                .description {
                  font-size: 18px;
                  color: #333;
                  margin: 20px 0;
                }
                .details {
                  margin: 30px 0;
                  font-size: 16px;
                  color: #555;
                }
                .footer {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 60px;
                  padding-top: 30px;
                  border-top: 2px solid #ddd;
                }
                .signature {
                  text-align: center;
                }
                .signature-line {
                  width: 200px;
                  border-top: 2px solid #333;
                  margin: 10px auto;
                  padding-top: 10px;
                  font-size: 14px;
                  color: #555;
                }
                .date {
                  text-align: center;
                  margin-top: 30px;
                  font-size: 14px;
                  color: #777;
                }
                @media print {
                  body {
                    padding: 0;
                    background: white;
                  }
                }
              </style>
            </head>
            <body>
              <div class="certificate">
                <div class="header">
                  <div class="logo">🏥</div>
                  <h1 style="color: #E63946; margin: 0; font-size: 28px;">NSS Care Network</h1>
                  <p style="color: #0077B6; margin: 5px 0;">National Service Scheme Blood, Health & Support Platform</p>
                </div>
                
                <div class="title">CERTIFICATE OF PARTICIPATION</div>
                <div class="subtitle">This is to certify that</div>
                
                <div class="content">
                  <div class="recipient">${volunteerName}</div>
                  ${college ? `<div class="description">${college}</div>` : ''}
                  
                  <div class="description">
                    has successfully participated as a <strong>${role}</strong> in
                  </div>
                  
                  <div class="details">
                    <strong style="color: #0077B6; font-size: 20px;">${campTitle}</strong><br/>
                    Date: ${new Date(campDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>
                    Service Hours: <strong>${hoursServed} hours</strong>
                  </div>
                  
                  <div class="description">
                    Their dedication and commitment to community service is greatly appreciated.
                  </div>
                </div>
                
                <div class="footer">
                  <div class="signature">
                    <div class="signature-line">Coordinator Signature</div>
                  </div>
                  <div class="signature">
                    <div class="signature-line">Program Officer</div>
                  </div>
                </div>
                
                <div class="date">
                  Issued on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card
        ref={certificateRef}
        className="relative overflow-hidden border-8 border-[#E63946] bg-white p-12"
      >
        {/* Decorative border */}
        <div className="absolute inset-8 rounded border-2 border-[#0077B6]" />

        {/* Content */}
        <div className="relative z-10 space-y-6 text-center">
          {/* Header */}
          <div className="space-y-2">
            <Award className="mx-auto h-16 w-16 text-[#E63946]" />
            <h2 className="text-[#E63946]">NSS Care Network</h2>
            <p className="text-sm text-[#0077B6]">
              National Service Scheme Blood, Health & Support Platform
            </p>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl text-gray-900">Certificate of Participation</h1>
            <p className="text-xl text-[#0077B6]">This is to certify that</p>
          </div>

          {/* Recipient */}
          <div className="space-y-2">
            <div className="inline-block border-b-4 border-[#E63946] pb-2">
              <h2 className="text-4xl text-[#E63946]">{volunteerName}</h2>
            </div>
            {college && <p className="text-gray-600">{college}</p>}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              has successfully participated as a <strong>{role}</strong> in
            </p>

            <div className="rounded-lg bg-[#0077B6]/5 p-6 space-y-2">
              <h3 className="text-2xl text-[#0077B6]">{campTitle}</h3>
              <p className="text-gray-600">
                Date:{" "}
                {new Date(campDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-gray-900">
                Service Hours: <strong>{hoursServed} hours</strong>
              </p>
            </div>

            <p className="text-gray-700">
              Their dedication and commitment to community service is greatly
              appreciated.
            </p>
          </div>

          {/* Signatures */}
          <div className="flex justify-around pt-12">
            <div className="text-center">
              <div className="mb-2 h-12 w-48 border-t-2 border-gray-400" />
              <p className="text-sm text-gray-600">Coordinator Signature</p>
            </div>
            <div className="text-center">
              <div className="mb-2 h-12 w-48 border-t-2 border-gray-400" />
              <p className="text-sm text-gray-600">Program Officer</p>
            </div>
          </div>

          {/* Date */}
          <div className="pt-6 text-sm text-gray-500">
            Issued on:{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </Card>

      <Button onClick={handleDownload} className="w-full bg-[#E63946] hover:bg-[#d62839]">
        <Download className="mr-2 h-4 w-4" />
        Download Certificate
      </Button>
    </div>
  );
}
