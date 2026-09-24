import type { Metadata } from "next";
import Link from "next/link";
import ModelSourcePicker from "@/components/upload/ModelSourcePicker";
import StepIndicator from "@/components/configure/StepIndicator";

export const metadata: Metadata = {
  title: "Upload your design",
  description: "Upload an STL, OBJ or 3MF file, or paste a Printables link, and get an instant print quote.",
};

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 md:py-20">
      <StepIndicator current={1} />
      <h1 className="mt-8 text-display text-3xl text-text md:text-4xl">Upload your design</h1>
      <p className="mt-2 text-text-dim">
        Upload a file for an instant, material-based quote — or paste a link to a model you found on Printables.
      </p>

      <div className="mt-8">
        <ModelSourcePicker />
      </div>

      <p className="mt-8 text-center text-sm text-text-faint">
        Don&apos;t have a design?{" "}
        <Link href="/designs" className="font-medium text-text underline underline-offset-2">
          Browse ready-made designs
        </Link>{" "}
        instead.
      </p>
    </div>
  );
}
