import React, { useEffect, useRef } from "react";

interface NdunakagramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface NdunakagramLoginWidgetProps {
  botName: string;
  onAuth: (user: NdunakagramUser) => void;
  buttonSize?: "large" | "medium" | "small";
  cornerRadius?: number;
  requestAccess?: "write" | "none";
  usePic?: boolean;
}

export const NdunakagramLoginWidget: React.FC<NdunakagramLoginWidgetProps> = ({
  botName,
  onAuth,
  buttonSize = "large",
  cornerRadius,
  requestAccess = "write",
  usePic = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Define the global callback that the widget will trigger
    const callbackName = `onNdunakagramAuth_${Math.random().toString(36).substring(7)}`;
    (window as any)[callbackName] = (user: NdunakagramUser) => {
      onAuth(user);
    };

    // 2. Create the script element
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", buttonSize);
    script.setAttribute("data-onauth", `${callbackName}(user)`);
    script.setAttribute("data-request-access", requestAccess);
    
    if (cornerRadius !== undefined) {
      script.setAttribute("data-radius", cornerRadius.toString());
    }
    
    if (!usePic) {
      script.setAttribute("data-userpic", "false");
    }

    // 3. Inject the script into the container
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    // 4. Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      delete (window as any)[callbackName];
    };
  }, [botName, onAuth, buttonSize, cornerRadius, requestAccess, usePic]);

  return <div ref={containerRef} className="ndunakagram-login-container" />;
};
