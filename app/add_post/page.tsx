"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddPostPage() {
  const [postType, setPostType] = useState<"lost" | "found">("lost");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(false);
  const maxImages = 3;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
  const files = Array.from(e.target.files || []);

  if (images.length + files.length > maxImages) {
    alert("You can upload up to 3 images only.");
    return;
  }

  setImages((prev) => [...prev, ...files]);
}

    function removeImage(index: number) {
  setImages((prev) => prev.filter((_, i) => i !== index));
}

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (images.length < 1 || images.length > 3) {
      setImageError("Please upload between 1 and 3 images.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Post submitted successfully!");
    }, 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-[#3DADFF] text-white rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-center font-bold">
            Add Lost / Found Item
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel>Post Type</FieldLabel>

                <div
                  onClick={() =>
                    setPostType(postType === "lost" ? "found" : "lost")
                  }
                  className="relative w-full h-12 bg-white rounded-full cursor-pointer flex items-center"
                >
                  <div
                    className={`absolute top-1 left-1 h-10 w-1/2 rounded-full transition-all ${
                      postType === "lost"
                        ? "translate-x-0 bg-[#0689E9]"
                        : "translate-x-full bg-green-500"
                    }`}
                  />

                  <div className="relative z-10 flex w-full text-sm font-semibold">
                    <div className="w-1/2 text-center text-black">Lost</div>
                    <div className="w-1/2 text-center text-black">Found</div>
                  </div>
                </div>
              </Field>

              <Field>
                <FieldLabel>Item Name</FieldLabel>
                <Input
                  className="bg-white text-black"
                  placeholder="e.g. Black Wallet"
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Category</FieldLabel>
                <Input
                  className="bg-white text-black"
                  placeholder="e.g. ID Card, Electronics"
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Location</FieldLabel>
                <Input
                  className="bg-white text-black"
                  placeholder="Where it was lost / found"
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  className="bg-white text-black"
                  placeholder="Additional details..."
                />
              </Field>

              <Field>
            <FieldLabel>Photos (1–3)</FieldLabel>

            <div className="flex gap-3 flex-wrap">
                {/* Image previews */}
                {images.map((file, index) => (
                <div
                    key={index}
                    className="relative w-24 h-24 rounded-lg overflow-hidden border"
                >
                    <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-full object-cover"
                    />
                    <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs"
                    >
                    ✕
                    </button>
                </div>
                ))}

                {images.length < maxImages && (
                <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer bg-white text-gray-400 hover:bg-gray-100">
                    <span className="text-2xl">＋</span>
                    <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                    />
                </label>
                )}
            </div>
            </Field>


              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-gray-200"
              >
                {loading
                  ? "Submitting..."
                  : `Submit ${postType === "lost" ? "Lost" : "Found"} Item`}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
