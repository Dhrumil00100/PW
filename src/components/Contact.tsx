import { useState, useEffect, FormEvent } from "react";
import { 
  LuUser, 
  LuMail, 
  LuTag, 
  LuMessageSquare, 
  LuSend, 
  LuMapPin 
} from "react-icons/lu";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import "./styles/Contact.css";
import { config } from "../config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const contactTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 80%",
        end: "bottom center",
        toggleActions: "play none none none",
      },
    });

    contactTimeline.fromTo(
      ".contact-left-content",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    contactTimeline.fromTo(
      ".get-in-touch-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    );

    return () => {
      contactTimeline.kill();
    };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject || "General Inquiry",
      message: formData.message
    };

    try {
      // First try calling the serverless API endpoint
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        // Fallback for local Vite dev / direct Telegram notification
        const token = "8521356018:AAFJOTnJ_bnWMLTRa5YrXdaHahexka5NTTo";
        const chatId = "7112907770";
        const text = `📩 *New Portfolio Inquiry!*\n\n👤 *Name:* ${payload.name}\n✉️ *Email:* ${payload.email}\n🏷️ *Subject:* ${payload.subject}\n\n💬 *Message:*\n${payload.message}`;

        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "Markdown"
          })
        });

        if (tgRes.ok) {
          setSubmitted(true);
          setFormData({ name: "", email: "", subject: "", message: "" });
        } else {
          setSubmitError("Failed to send message. Please try again or email directly.");
        }
      }
    } catch (err) {
      // Direct Telegram fallback in case API route is unreachable locally
      try {
        const token = "8521356018:AAFJOTnJ_bnWMLTRa5YrXdaHahexka5NTTo";
        const chatId = "7112907770";
        const text = `📩 *New Portfolio Inquiry!*\n\n👤 *Name:* ${payload.name}\n✉️ *Email:* ${payload.email}\n🏷️ *Subject:* ${payload.subject}\n\n💬 *Message:*\n${payload.message}`;

        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "Markdown"
          })
        });

        if (tgRes.ok) {
          setSubmitted(true);
          setFormData({ name: "", email: "", subject: "", message: "" });
        } else {
          setSubmitError("Failed to send message. Please try again.");
        }
      } catch (fallbackErr) {
        setSubmitError("Could not send message. Please check connection.");
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="contact-section" id="contact">
      {/* Background Ambient Glow */}
      <div className="ambient-background-glow"></div>

      <div className="contact-main-container section-container">
        {/* Two Column Grid */}
        <div className="contact-grid-layout">
          {/* Left Column: Heading, CV Button & Form */}
          <div className="contact-left-content">
            <div className="contact-left-header">
              <div>
                <span className="contact-subtitle-tag">GET IN TOUCH</span>
                <h2 className="contact-main-heading">
                  Let’s Build <br />
                  <span className="purple-gradient-text">Something Great</span>
                </h2>
              </div>
            </div>

            <p className="contact-description">
              Have a project in mind or just want to say hi?<br />
              I’m always open to discussing new ideas, collaborations, or opportunities.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row-two">
                <div className="input-group">
                  <LuUser className="input-icon" />
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <LuMail className="input-icon" />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="input-group full-width">
                <LuTag className="input-icon" />
                <input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="input-group full-width">
                <LuMessageSquare className="input-icon textarea-icon" />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="send-message-btn" 
                data-cursor="disable"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <LuSend /> Send Message
                  </>
                )}
              </button>

              {submitted && (
                <div className="form-success-toast">
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              {submitError && (
                <div className="form-error-toast" style={{ color: "#ff6b6b", marginTop: "10px", textAlign: "center", fontSize: "14px" }}>
                  {submitError}
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Get in Touch Card */}
          <div className="get-in-touch-card">
            <h3 className="card-heading">Get in touch</h3>
            <p className="card-subtext">I usually respond within 24 hours.</p>

            <div className="info-list">
              <div className="info-item">
                <div className="info-icon-badge">
                  <LuMail />
                </div>
                <div className="info-text">
                  <span className="info-label">Email</span>
                  <a href={`mailto:${config.contact.email}`} className="info-value-link">
                    {config.contact.email}
                  </a>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-badge">
                  <LuMapPin />
                </div>
                <div className="info-text">
                  <span className="info-label">Location</span>
                  <span className="info-value">{config.contact.location}</span>
                </div>
              </div>
            </div>

            <div className="connect-section">
              <h4 className="connect-heading">Connect with me</h4>
              <div className="social-links-list">
                <a
                  href={config.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-card-link"
                  data-cursor="disable"
                >
                  <div className="social-left">
                    <FaGithub />
                    <span>GitHub</span>
                  </div>
                  <MdArrowOutward className="social-arrow" />
                </a>

                <a
                  href={config.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-card-link"
                  data-cursor="disable"
                >
                  <div className="social-left">
                    <FaLinkedin />
                    <span>LinkedIn</span>
                  </div>
                  <MdArrowOutward className="social-arrow" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="contact-footer">
          <p>
            Designed and Developed by <span>{config.developer.fullName}</span> &nbsp;|&nbsp; © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
