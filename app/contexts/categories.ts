import { createContext, useContext } from "react";

import StreamCategoryType from "../types/stream_category";

const CategoriesContext = createContext<{
  liveCategories: StreamCategoryType[] | null | undefined;
  seriesCategories: StreamCategoryType[] | null | undefined;
  vodCategories: StreamCategoryType[] | null | undefined;
}>({ liveCategories: null, seriesCategories: null, vodCategories: null });

export const useCategoriesContext = () => useContext(CategoriesContext);

export default CategoriesContext;
