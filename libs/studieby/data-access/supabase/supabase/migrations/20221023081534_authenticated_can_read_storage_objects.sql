CREATE POLICY "Authenticated can view objects" ON "storage".objects
	AS PERMISSIVE
	FOR ALL
	TO authenticated
	USING (true);
