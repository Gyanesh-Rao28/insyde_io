// src/pages/ModelViewer.jsx
import { useState, useEffect, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";
import { toast } from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import { modelsAPI, getFullAssetUrl } from "../api/apiService";
import { useAuth } from "../context/AuthContext";
// Simple cube component for fallbacks
const FallbackCube = ({ color = "red" }) => (
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

// STL Model component
const STLModel = ({ url }) => {
  const [geometry, setGeometry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Loading STL from:", url);

    // Check if URL is undefined or empty
    if (!url) {
      console.error("Invalid URL provided to STLModel component");
      setError(new Error("Invalid model URL"));
      setLoading(false);
      return;
    }

    const loader = new STLLoader();

    // Add proper error handling
    try {
      loader.load(
        url,
        (geo) => {
          console.log("STL loaded successfully");

          try {
            geo.computeBoundingBox();
            const center = geo.boundingBox.getCenter(new THREE.Vector3());
            geo.translate(-center.x, -center.y, -center.z);

            // Rotate the model around the X-axis to face forward
            geo.rotateX(Math.PI); // 180 degrees rotation

            // Rotate the model around the Y-axis
            geo.rotateY(Math.PI / 2); // 90 degrees rotation

            // Scale model to a reasonable size
            const size = new THREE.Vector3();
            geo.boundingBox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            if (maxDim > 0) {
              const scale = 2 / maxDim; // Scale to fit within a 2-unit cube
              geo.scale(scale, scale, scale);
            }

            setGeometry(geo);
          } catch (processError) {
            console.error("Error processing geometry:", processError);
            setError(processError);
          }

          setLoading(false);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error) => {
          console.error("Error loading STL:", error);
          setError(error);
          setLoading(false);
        }
      );
    } catch (e) {
      console.error("Exception in STL loading:", e);
      setError(e);
      setLoading(false);
    }
  }, [url]);

  if (loading) {
    return <FallbackCube color="blue" />;
  }

  if (error || !geometry) {
    return <FallbackCube color="red" />;
  }

  return (
    <mesh>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color="#ff0000" // Red color for better visibility
        side={THREE.DoubleSide}
        flatShading={true}
      />
    </mesh>
  );
};

const OBJModel = ({ url }) => {
  const [model, setModel] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Loading OBJ from:", url);
    if (!url) {
      console.error("Invalid URL provided to OBJModel");
      setError(new Error("Invalid URL"));
      return;
    }

    const loadModel = async () => {
      try {
        const { OBJLoader } = await import(
          "three/examples/jsm/loaders/OBJLoader"
        );
        const loader = new OBJLoader();

        loader.load(
          url,
          (obj) => {
            console.log("OBJ loaded successfully");

            // Center and scale the model
            const box = new THREE.Box3().setFromObject(obj);
            const center = box.getCenter(new THREE.Vector3());
            obj.position.set(0, 0, 0);
            obj.rotation.x = Math.PI / 2;
            // Scale the model
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            if (maxDim > 0) {
              const scale = 2 / maxDim;
              obj.scale.set(scale, scale, scale);
            }

            // **NEW: Rotate the model around the Y-axis to face forward**
            obj.rotation.y = Math.PI; // 180 degrees rotation

            // Apply some default material if materials are missing
            obj.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                if (!child.material) {
                  child.material = new THREE.MeshStandardMaterial({
                    color: 0xcccccc,
                    roughness: 0.8,
                    metalness: 0.2,
                  });
                }
              }
            });

            setModel(obj);
            setIsLoaded(true);
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          (error) => {
            console.error("Error loading OBJ:", error);
            setError(error);
          }
        );
      } catch (e) {
        console.error("Exception in OBJ loading:", e);
        setError(e);
      }
    };

    loadModel();
  }, [url]);

  if (error) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  if (!isLoaded || !model) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="blue" wireframe />
      </mesh>
    );
  }

  return <primitive object={model} />;
};

// Component to render the 3D model based on its type
const ModelRenderer = ({ model }) => {
  // Check if model has filePath
  if (!model || !model.filePath) {
    console.error("Model or model.filePath is undefined");
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    );
  }

  // Build full URL
  const modelUrl = getFullAssetUrl(model.filePath);
  console.log("Model URL:", modelUrl, "Model type:", model.fileType);

  if (model.fileType === "STL") {
    return <STLModel url={modelUrl} />;
  } else if (model.fileType === "OBJ") {
    return <OBJModel url={modelUrl} />;
  } else {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    );
  }
};

// Download Modal Component
const DownloadModalComponent = ({
  isOpen,
  onClose,
  onDownload,
  onConvert,
  model,
  isConverting,
}) => {
  if (!isOpen) return null;
  const availableFormats = model.convertedFormats || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Download Model</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="mb-4">Select a format to download:</p>

        <div className="space-y-3">
          {/* Original format */}
          <button
            onClick={() => onDownload(null)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download as {model.fileType} (Original)
          </button>

          {/* Converted formats */}
          {availableFormats.map((format) => (
            <button
              key={format.format}
              onClick={() => onDownload(format.format)}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download as {format.format}
            </button>
          ))}

          {/* Option to convert if not available */}
          {!availableFormats.some((f) => f.format !== model.fileType) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Want to convert this model to another format?
              </p>
              {model.fileType === "STL" ? (
                <button
                  onClick={() => {
                    onClose();
                    onConvert("OBJ");
                  }}
                  disabled={isConverting}
                  className="w-full border border-blue-300 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition disabled:opacity-50"
                >
                  {isConverting ? "Converting..." : "Convert to OBJ"}
                </button>
              ) : model.fileType === "OBJ" ? (
                <button
                  onClick={() => {
                    onClose();
                    onConvert("STL");
                  }}
                  disabled={isConverting}
                  className="w-full border border-blue-300 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition disabled:opacity-50"
                >
                  {isConverting ? "Converting..." : "Convert to STL"}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ModelViewer = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [defaultView, setDefaultView] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Fetch model data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["model", id],
    queryFn: () => modelsAPI.getModelById(id),
    onSuccess: (response) => {
      // Set default view
      setDefaultView(response.data.data.defaultView);

      // Debug
      console.log("Model data:", response.data.data);
      if (!response.data.data.filePath) {
        console.error("Model has no filePath");
      }
    },
    onError: (error) => {
      console.error("Error fetching model:", error);
    },
  });
  const model = data?.data?.data;

  // Download model
  const downloadMutation = useMutation({
    mutationFn: ({ id, format }) => modelsAPI.downloadModel(id, format),
    onSuccess: (response) => {
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", model?.originalFilename || "model.stl");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Model downloaded successfully");
      // Refresh the model data to get updated counts
      refetch();
    },
    onError: (error) => {
      console.error("Download error:", error);
      if (error.response?.status === 401) {
        toast.error("Please log in to download models");
        navigate("/login");
      } else {
        toast.error(
          "Failed to download model: " + (error.message || "Unknown error")
        );
      }
    },
  });

  const convertMutation = useMutation({
    mutationFn: ({ modelId, targetFormat }) =>
      modelsAPI.convertModel(modelId, targetFormat),
    onSuccess: (response) => {
      toast.success(
        `Model converted to ${response.data.data.format} successfully`
      );
      // Refresh model data to show the new format
      refetch();
    },
    onError: (error) => {
      console.error("Conversion error:", error);
      toast.error(
        `Conversion failed: ${error.response?.data?.message || "Unknown error"}`
      );
    },
    onSettled: () => {
      setIsConverting(false);
    },
  });

  const handleConvert = (targetFormat) => {
    if (!isAuthenticated) {
      toast.error("Please log in to convert models");
      navigate("/login");
      return;
    }

    setIsConverting(true);
    convertMutation.mutate({ modelId: id, targetFormat });
  };

  const handleDownload = (format = null) => {
    if (!isAuthenticated) {
      toast.error("Please log in to download models");
      navigate("/login");
      return;
    }

    if (!model || !model._id) {
      toast.error("Cannot download: Invalid model data");
      return;
    }

    downloadMutation.mutate({ id, format });
    setIsDownloadModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="text-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-2 text-gray-600">Loading model...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-500">
              Error loading model. Please try again.
            </p>
          </div>
        ) : !model ? (
          <div className="text-center py-12">
            <p className="text-red-500">
              Model not found or invalid data received.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* 3D Viewer */}
              <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-[500px] w-full">
                  <Canvas
                    shadows
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    style={{ background: "#f5f5f5" }}
                  >
                    <color attach="background" args={["#f5f5f5"]} />
                    <ambientLight intensity={0.7} />
                    <directionalLight
                      position={[10, 10, 5]}
                      intensity={1}
                      castShadow
                    />
                    <directionalLight
                      position={[-10, -10, -5]}
                      intensity={0.5}
                    />

                    <Suspense fallback={<FallbackCube color="blue" />}>
                      <ModelRenderer model={model} />
                    </Suspense>

                    <OrbitControls
                      enablePan={true}
                      enableZoom={true}
                      enableRotate={true}
                      minDistance={1}
                      maxDistance={10}
                    />
                    <gridHelper args={[10, 10]} position={[0, -1, 0]} />
                    <axesHelper args={[5]} />
                  </Canvas>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Use mouse to rotate. Scroll to zoom. Shift + drag to pan.
                  </div>
                </div>
              </div>

              {/* Model Info */}
              <div className="md:w-1/3 bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-2">{model.name}</h1>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-3">{model.fileType} file</span>
                  <span>{(model.fileSize / 1024).toFixed(2)} KB</span>
                </div>

                {model.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Description
                    </h3>
                    <p className="text-gray-600">{model.description}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Upload Info
                  </h3>
                  <p className="text-gray-600">
                    Uploaded {new Date(model.createdAt).toLocaleDateString()} by{" "}
                    {model.uploadedBy?.username || "Unknown"}
                  </p>
                </div>

                {/* Removed view count display */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>{model.downloadCount} downloads</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsDownloadModalOpen(true)}
                    disabled={downloadMutation.isPending}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center justify-center"
                  >
                    {downloadMutation.isPending ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </>
                    )}
                  </button>

                  {/* Add this button below the download button */}
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Convert Format
                    </h3>
                    <div className="space-y-2">
                      {model.fileType === "STL" ? (
                        <button
                          onClick={() => handleConvert("OBJ")}
                          disabled={isConverting}
                          className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
                        >
                          {isConverting ? "Converting..." : "Convert to OBJ"}
                        </button>
                      ) : model.fileType === "OBJ" ? (
                        <button
                          onClick={() => handleConvert("STL")}
                          disabled={isConverting}
                          className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
                        >
                          {isConverting ? "Converting..." : "Convert to STL"}
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Display available formats section */}
                  {model.convertedFormats &&
                    model.convertedFormats.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Available Formats
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            This model is available in multiple formats. Use the
                            download button to select your preferred format.
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            <li>Original: {model.fileType}</li>
                            {model.convertedFormats.map((format) => (
                              <li key={format.format}>
                                Converted: {format.format}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Download Modal */}
      {!isLoading && model && (
        <DownloadModalComponent
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
          onDownload={handleDownload}
          onConvert={handleConvert}
          model={model}
          isConverting={isConverting}
        />
      )}
    </MainLayout>
  );
};

export default ModelViewer;