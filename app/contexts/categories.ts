import { createContext, useContext } from 'react'

import StreamCategoryType from '../types/stream_category'

const CategoriesContext = createContext<{
    liveCategories: StreamCategoryType[] | null
    seriesCategories: StreamCategoryType[] | null
    vodCategories: StreamCategoryType[] | null
}>({ liveCategories: null, seriesCategories: null, vodCategories: null })

export const useCategoriesContext = () => useContext(CategoriesContext);

export default CategoriesContext