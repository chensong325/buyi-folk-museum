import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Site'
import { HomePage } from './pages/Home'
import { CollagePage, CostumePage, PatternsPage, ProcessPage } from './pages/Craft'
import { ChabaiPage, InstrumentsPage, OperaPage, SongsPage } from './pages/Stage'
import { CourtshipPage, FoodPage, GeographyPage, LiuyueliuPage } from './pages/Season'
import { CopyrightPage, CreativePage } from './pages/Other'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/craft/process" element={<ProcessPage />} />
        <Route path="/craft/patterns" element={<PatternsPage />} />
        <Route path="/craft/costume" element={<CostumePage />} />
        <Route path="/craft/collage" element={<CollagePage />} />
        <Route path="/stage/instruments" element={<InstrumentsPage />} />
        <Route path="/stage/opera" element={<OperaPage />} />
        <Route path="/stage/songs" element={<SongsPage />} />
        <Route path="/stage/chabai" element={<ChabaiPage />} />
        <Route path="/season/liuyueliu" element={<LiuyueliuPage />} />
        <Route path="/season/food" element={<FoodPage />} />
        <Route path="/season/courtship" element={<CourtshipPage />} />
        <Route path="/season/geography" element={<GeographyPage />} />
        <Route path="/creative" element={<CreativePage />} />
        <Route path="/copyright" element={<CopyrightPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
