import React, { useState } from "react";
import { Facebook, Twitter, Linkedin, Link, Check } from "lucide-react";

const ShareSection = () => {
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;

  const handleShare = (platform) => {
    let url = "";

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl
        )}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          currentUrl
        )}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          currentUrl
        )}`;
        break;
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          currentUrl
        )}`;
        break;
      default:
        break;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        Share this article
      </h3>
      <div className="flex flex-wrap gap-4">
        {/* Facebook */}
        <button
          onClick={() => handleShare("facebook")}
          className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-sm"
        >
          <Facebook size={20} />
          <span>Facebook</span>
        </button>

        {/* Twitter */}
        <button
          onClick={() => handleShare("twitter")}
          className="flex items-center gap-2 px-6 py-3 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-colors shadow-sm"
        >
          <Twitter size={20} />
          <span>Twitter</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleShare("linkedin")}
          className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors shadow-sm"
        >
          <Linkedin size={20} />
          <span>LinkedIn</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all shadow-sm border ${
            copied
              ? "bg-green-100 border-green-200 text-green-700"
              : "bg-white border-rose-200 text-rose-600 hover:bg-rose-50"
          }`}
        >
          {copied ? <Check size={20} /> : <Link size={20} />}
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </button>
      </div>
    </div>
  );
};

export default ShareSection;
