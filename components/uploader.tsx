"use client";

import { useState, useCallback, useMemo, ChangeEvent } from "react";
import toast from "react-hot-toast";
import LoadingDots from "./loading-dots";

export default function Uploader({ onUpdateMap }: { onUpdateMap: any }) {
  const [data, setData] = useState<{
    file: string | null;
  }>({
    file: null,
  });

  const [file, setFile] = useState<File | null>(null);

  const [dragActive, setDragActive] = useState(false);

  const onChangePicture = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 50) {
          toast.error("File size too big (max 50MB)");
        } else {
          setFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setData((prev) => ({ ...prev, file: e.target?.result as string }));
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setData],
  );

  const [saving, setSaving] = useState(false);

  const saveDisabled = useMemo(() => {
    return !data.file || saving;
  }, [data.file, saving]);

  return (
    <form
      className="grid gap-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        const formdata = new FormData();
        formdata.append("file", file as File);
        fetch("https://task-api.justhomemaker.com/tasks/upload", {
          method: "POST",
          body: formdata,
        })
          .then((response) => response.json())
          .then((data) => {
            const poll = () => {
              fetch(
                `https://task-api.justhomemaker.com/tasks/result/${data["result_id"]}`,
              )
                .then((response) => response.json())
                .then((data) => {
                  onUpdateMap(data);
                  if (!data["ready"]) {
                    setTimeout(poll, 500);
                  } else if (!data["successful"]) {
                    console.error("upload", data);
                  }
                });
            };
            poll();

            //   if (res.status === 200) {
            //     const { url } = (await res.json()) as BlobResult;
            //     toast(
            //       (t) => (
            //         <div className="relative">
            //           <div className="p-2">
            //             <p className="font-semibold text-gray-900">
            //               File uploaded!
            //             </p>
            //             <p className="mt-1 text-sm text-gray-500">
            //               Convert result{" "}
            //               <a
            //                 className="font-medium text-gray-900 underline"
            //                 href={url}
            //                 target="_blank"
            //                 rel="noopener noreferrer"
            //               >
            //                 {url}
            //               </a>
            //             </p>
            //           </div>
            //           <button
            //             onClick={() => toast.dismiss(t.id)}
            //             className="absolute top-0 -right-2 inline-flex text-gray-400 focus:outline-none focus:text-gray-500 rounded-full p-1.5 hover:bg-gray-100 transition ease-in-out duration-150"
            //           >
            //             <svg
            //               className="h-5 w-5"
            //               viewBox="0 0 20 20"
            //               fill="currentColor"
            //             >
            //               <path
            //                 fillRule="evenodd"
            //                 d="M5.293 5.293a1 1 0 011.414 0L10
            //                   8.586l3.293-3.293a1 1 0 111.414 1.414L11.414
            //                   10l3.293 3.293a1 1 0 01-1.414 1.414L10
            //                   11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586
            //                   10 5.293 6.707a1 1 0 010-1.414z"
            //                 clipRule="evenodd"
            //               />
            //             </svg>
            //           </button>
            //         </div>
            //       ),
            //       { duration: 300000 },
            //     );
            //   } else {
            //     const error = await res.text();
            //     toast.error(error);
            //   }
            setSaving(false);
          });
      }}
    >
      <div>
        <div className="space-y-1 mb-4">
          <h2 className="text-xl font-semibold">Upload a file</h2>
          <p className="text-sm text-gray-500">
            Accepted formats: .xlsx, .csv, .xls
          </p>
        </div>
        <label
          htmlFor="image-upload"
          className="group relative mt-2 flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300] bg-white shadow-sm transition-all hover:bg-gray-50"
        >
          <div
            className="absolute z-[5] h-full w-full rounded-md"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);

              const file = e.dataTransfer.files && e.dataTransfer.files[0];
              if (file) {
                if (file.size / 1024 / 1024 > 50) {
                  toast.error("File size too big (max 50MB)");
                } else {
                  setFile(file);
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setData((prev) => ({
                      ...prev,
                      file: e.target?.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
          />
          <div
            className={`absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${"bg-white opacity-100 hover:bg-gray-50"}`}
          >
            <svg
              className={`${
                dragActive ? "scale-110" : "scale-100"
              } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
              <path d="M12 12v9"></path>
              <path d="m16 16-4-4-4 4"></path>
            </svg>
            <p className="mt-2 text-center text-sm text-gray-500">
              Drag and drop or click to upload.
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              Max file size: 50MB
            </p>
            <span className="sr-only">Photo upload</span>
          </div>
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id="image-upload"
            name="image"
            type="file"
            accept=".xls, .xlsx, .csv"
            className="sr-only"
            onChange={onChangePicture}
          />
        </div>
      </div>

      <button
        disabled={saveDisabled}
        className={`${
          saveDisabled
            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
            : "border-black bg-black text-white hover:bg-white hover:text-black"
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
      >
        {saving ? (
          <LoadingDots color="#808080" />
        ) : (
          <p className="text-sm">Confirm upload</p>
        )}
      </button>
    </form>
  );
}
