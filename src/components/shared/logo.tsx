import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo/assignmate_logo.svg"
      alt="AssignMate"
      width={200}
      height={50}
      loading="eager"
      className="h-auto w-40"
    />
  );
}
