import { storage } from "@/config/firebase";
import * as ImageManipulator from "expo-image-manipulator";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const storageService = {
  /**
   * Comprime y sube una imagen a Firebase Storage.
   * @param uri URI de la imagen local
   * @param userId ID del usuario para la ruta en Storage
   * @param index Índice para nombres únicos si se suben múltiples
   * @returns URL de descarga de la imagen subida
   */
  async subirImagen(uri: string, userId: string, index: number = 0): Promise<string> {
    try {
      // 1. Comprimir imagen
      const fotoComprimida = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Redimensionar
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
      );

      // 2. Obtener el blob
      const response = await fetch(fotoComprimida.uri);
      const blob = await response.blob();

      // 3. Crear referencia y subir
      const nombreArchivo = `users/${userId}/palomas/${Date.now()}_${index}.jpg`;
      const storageRef = ref(storage, nombreArchivo);

      await uploadBytes(storageRef, blob);
      
      // 4. Retornar URL pública
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error subiendo imagen a storage:", error);
      throw error;
    }
  },

  /**
   * Elimina una imagen de Firebase Storage usando su URL.
   * @param url URL de descarga de la imagen en Storage
   */
  async eliminarImagen(url: string): Promise<void> {
    try {
      // Validamos que sea una URL de firebase storage
      if (!url.includes("firebasestorage.googleapis.com")) return;
      
      const fotoRef = ref(storage, url);
      await deleteObject(fotoRef);
    } catch (error) {
      console.error("Error eliminando imagen de storage:", error);
      // No lanzamos error para que no bloquee otros flujos, pero lo registramos
    }
  }
};
