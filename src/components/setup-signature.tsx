import { useAuth } from "@/context/AuthContext";
import { dataURLtoFile } from "@/utils/dataUrlToFile";
import { useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SetupSignature({ signatureProps }: any) {
  const [signature, setSignature] = useState<SignatureCanvas | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const { user } = useAuth();

  const handleSignatureChange = () => {
    if (signature && !signature.isEmpty()) {
      const dataUrl = signature.toDataURL("image/png");
      const toDataurl = dataURLtoFile(dataUrl, `${user?.userName}.png`);
      signatureProps(toDataurl);
      setIsEmpty(false);
    }
  };

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    signature?.clear();
    signatureProps(null);
    setIsEmpty(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-base-content">
          Draw your signature below
        </p>
        {!isEmpty && (
          <span className="text-xs text-success font-medium">✓ Signature captured</span>
        )}
      </div>

      <div className="border-2 border-dashed border-base-300 rounded-xl overflow-hidden transition-colors hover:border-primary/50">
        <SignatureCanvas
          penColor="black"
          ref={(ref) => setSignature(ref)}
          canvasProps={{
            className: "sigCanvas w-full h-52 bg-white",
          }}
          onEnd={handleSignatureChange}
          velocityFilterWeight={0.7}
          minWidth={1.5}
          maxWidth={2.5}
          throttle={10}
          dotSize={1.5}
        />
      </div>

      <p className="text-xs text-base-content/40 text-center">
        Use your mouse or touch to sign inside the box
      </p>

      <button
        onClick={handleClear}
        type="button"
        className="self-start text-xs text-base-content/40 hover:text-error underline transition-colors"
      >
        Clear signature
      </button>
    </div>
  );
}
