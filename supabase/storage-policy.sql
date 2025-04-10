-- Разрешаем публичный доступ для чтения файлов
CREATE POLICY "Give public access to all files" ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

-- Разрешаем всем загружать файлы
CREATE POLICY "Allow public uploads to photos folder" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'photos');

-- Разрешаем всем обновлять файлы
CREATE POLICY "Allow public updates to photos folder" ON storage.objects FOR UPDATE
USING (bucket_id = 'photos');

-- Разрешаем всем удалять файлы
CREATE POLICY "Allow public deletes from photos folder" ON storage.objects FOR DELETE
USING (bucket_id = 'photos'); 