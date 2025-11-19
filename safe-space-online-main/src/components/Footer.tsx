import { Shield, Mail, Twitter, Linkedin, Github } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const footerLinks = {
    Product: [
      { name: "Features", path: "/#features" },
      { name: "How It Works", path: "/#how-it-works" },
      { name: "Pricing", path: "/#pricing" },
      { name: "FAQ", path: "/#faq" },
    ],
    Resources: [
      { name: "Blog", path: "/resources" },
      { name: "Guides", path: "/resources" },
      { name: "Community", path: "/community" },
      { name: "Support", path: "/resources" },
    ],
    Company: [
      { name: "About", path: "/#about" },
      { name: "Contact", path: "/#contact" },
      { name: "Privacy", path: "/privacy" },
      { name: "Terms", path: "/terms" },
    ],
  };

  return (
    <footer className="relative border-t border-border/50 bg-card">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-heading font-bold gradient-text">
                SAFESPACE
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              A safer digital world for everyone. Personalized protection for every age and gender.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-heading font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.path}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 SAFESPACE. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Made with ❤️ for a safer digital world
          </p>
        </div>
      </div>
    </footer>
  );
};
