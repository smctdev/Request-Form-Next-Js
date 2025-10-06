import { useAuth } from "@/context/AuthContext";
import { dataURLtoFile } from "@/utils/dataUrlToFile";
import { useEffect, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SetupSignature({ signatureProps }: any) {
  const [signature, setSignature] = useState<SignatureCanvas | null>(null);
  const { user } = useAuth();

  const handleSignatureChange = () => {
    if (signature && !signature.isEmpty()) {
      const dataUrl = signature.toDataURL("image/png");
      const toDataurl = dataURLtoFile(dataUrl, `${user?.userName}.png`);
      signatureProps(toDataurl);
    }
  };

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    signature?.clear();
    signatureProps(null);
  };

  return (
    <div>
      <div className="flex flex-col w-full mb-4">
        <h1>Signature</h1>
        <SignatureCanvas
          penColor="black"
          ref={(ref) => setSignature(ref)}
          canvasProps={{
            className: "sigCanvas border border-black h-96 w-full bg-gray-100",
          }}
          onEnd={handleSignatureChange}
          velocityFilterWeight={0.7} // Reduces stringy effect (default: 0.7)
          minWidth={1.5} // Minimum stroke width
          maxWidth={2.5} // Maximum stroke width
          throttle={10} // Reduces points for smoother lines
          dotSize={1.5}
        />
        {!signature && (
          <span className="text-xs text-red-500">
            Please provide a signature.
          </span>
        )}
        <button
          onClick={handleClear}
          type="button"
          className="p-1 mt-2 bg-gray-300 rounded-lg cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
