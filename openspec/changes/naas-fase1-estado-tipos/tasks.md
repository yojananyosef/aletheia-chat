# Tasks — naas-fase1-estado-tipos

- [x] 1.1 Unificar `BookInfo/FavoriteMessage/Speaker`; `types/bible.ts` re-exporta (`domain/` es single source); `Speaker = CanonicalSpeaker | (string & {})`; fix imports.
- [x] 1.2 `Message`: API única métodos (`isTitle/isNarratorFlow/requiresManualAdvance`); `InputBar` tipa clase `Message` del dominio.
- [x] 1.3 Extraer `useFavoritesToggle(id, bookId, data?)`; Home/Chat/Drawer con la misma firma (`FavoritesDrawer` recibe el fav completo).
- [x] 1.4 `useBookFilter` controlado + `normalizeEs` (trim/lower/NFD/diacríticos); test tildes; `HomeView` usa `homeSearchQuery` global.
- [x] 1.5 Renombrar `useSpiritualLevel` → `getSpiritualLevel` (+alias deprecated); `READING_SPEEDS` sin `val` (+comentario de semántica).
- [x] 1.6 `noUnusedLocals/noUnusedParameters:true` y limpiar muertos; `UIStateContext` + `PersistentStateContext` con `useMemo`; `subscribe` con guard SSR; `FAVORITES_STORAGE_KEY` única en `StorageService`; `pnpm lint test build` verde (35 tests).
