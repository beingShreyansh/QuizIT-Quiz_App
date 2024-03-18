const signedUrlResponse = await axios.get(
    `${import.meta.env.VITE_API_URL}/auth/get-signed-url`,
    {
      params: {
        fileName: selectedImage.name,
        contentType: selectedImage.type,
      },
    }
  );

  const signedUrl = signedUrlResponse.data.signedUrl;
  const imageId = signedUrlResponse.data.imageId;
  await axios.put(signedUrl, selectedImage);