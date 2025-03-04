export function initializeSchedule() {
  const uploadBox = document.querySelector(".upload-box");
  const selectButton = document.getElementById("select-photo-btn");
  const scheduleButton = document.querySelector(".cta");
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const tagsInput = document.getElementById("tags");
  const endTimeInput = document.getElementById("end-time");
  let uploadedFile = null; // Store the uploaded file

  console.log("initializeSchedule called"); // Debug log

  // Set the start-time dynamically to the current time
  const currentDate = new Date();
  const startTime = currentDate.toISOString(); // Get the current time in ISO format
  document.getElementById("start-time").value = startTime; // Set the hidden start-time field

  // Drag-and-Drop Events
  uploadBox?.addEventListener("dragover", handleDragOver);
  uploadBox?.addEventListener("dragleave", handleDragLeave);
  uploadBox?.addEventListener("drop", (event) => {
    event.preventDefault();
    uploadBox.classList.remove("drag-over");
    handleFileUpload(event.dataTransfer.files, uploadBox);
  });

  // File selection via button click
  selectButton?.addEventListener("click", () => {
    console.log("Select button clicked"); // Debug log
    const fileInput = createFileInput();
    fileInput.click();
  });

  // Schedule Button Logic
  scheduleButton?.addEventListener("click", async () => {
    console.log("Schedule button clicked"); // Debug log

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const tags = tagsInput.value.trim();
    const endTime = endTimeInput.value; // Get the user-selected end time

    if (!title || !description || !tags || !uploadedFile || !endTime) {
      alert("Please fill in all fields and upload an image before scheduling.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("image", uploadedFile);
    formData.append("start_time", startTime); // Append the dynamically set start-time
    formData.append("end_time", endTime); // Append the user-selected end-time

    console.log([...formData.entries()]); // Log form data

    try {
      const response = await fetch("/api/content-data/", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result);  // Log the entire response

      if (response.ok) {
        alert("Content scheduled successfully!");
        titleInput.value = "";
        descriptionInput.value = "";
        tagsInput.value = "";
        uploadBox.innerHTML = '<p>drag or drop a file to upload.</p>';
        uploadedFile = null;
      } else {
        alert(`Failed to schedule content: ${result.detail}`);
      }
    } catch (error) {
      console.error("Error scheduling content:", error);
      alert("An error occurred while scheduling content.");
    }
  });

  // Drag-and-Drop Handlers
  function handleDragOver(event) {
    event.preventDefault();
    uploadBox.classList.add("drag-over");
  }

  function handleDragLeave() {
    uploadBox.classList.remove("drag-over");
  }

  // Create File Input for Button Selection
  function createFileInput() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", (event) => {
      handleFileUpload(event.target.files, uploadBox);
    });
    return fileInput;
  }

  // File Upload and Preview Logic
  function handleFileUpload(files, uploadBox) {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      alert("Please upload a valid image file.");
      return;
    }

    uploadedFile = validFiles[0];
    uploadBox.innerHTML = "";

    const reader = new FileReader();
    reader.onload = () => {
      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("img-wrapper");

      const img = document.createElement("img");
      img.src = reader.result;
      img.alt = uploadedFile.name;
      img.classList.add("uploaded-img");

      const imgName = document.createElement("p");
      imgName.textContent = uploadedFile.name;

      imgWrapper.appendChild(img);
      imgWrapper.appendChild(imgName);
      uploadBox.appendChild(imgWrapper);
    };
    reader.readAsDataURL(uploadedFile);

    uploadBox.style.border = "none";
  }
}


