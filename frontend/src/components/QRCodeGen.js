import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeGen({ value }) {
  return (
    <div className="flex flex-col items-center">
      <QRCodeCanvas value={value} size={180} />
      <p className="mt-2 text-xs break-all">{value}</p>
    </div>
  );
} 