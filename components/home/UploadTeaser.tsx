import UploadDropzone from "@/components/upload/UploadDropzone";

export default function UploadTeaser() {
  return (
    <section className="px-5 py-16 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-display text-2xl text-text md:text-3xl">Got a 3D file?</h2>
        <p className="mt-2 text-text-dim">
          Upload it. Choose how you want it printed. We&apos;ll handle the rest.
        </p>

        <div className="mt-8 text-left">
          <UploadDropzone />
        </div>
      </div>
    </section>
  );
}
