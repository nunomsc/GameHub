import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '../css/app.css'
import { DownloadProvider } from './context/DownloadContext'
import DownloadBar from './components/layout/DownloadBar'
import Library from './pages/Library'
import GameDetailPage from './pages/GameDetailPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminGames from './pages/admin/AdminGames'
import AdminGameForm from './pages/admin/AdminGameForm'
import AdminVersions from './pages/admin/AdminVersions'
import AdminScreenshots from './pages/admin/AdminScreenshots'
import AdminLookups from './pages/admin/AdminLookups'

createRoot(document.getElementById('app')).render(
    <BrowserRouter>
        <DownloadProvider>
            <Routes>
                <Route path="/" element={<Library />} />
                <Route path="/games/:slug" element={<GameDetailPage />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="games" element={<AdminGames />} />
                    <Route path="games/new" element={<AdminGameForm />} />
                    <Route path="games/:id/edit" element={<AdminGameForm />} />
                    <Route path="games/:id/versions" element={<AdminVersions />} />
                    <Route path="games/:id/screenshots" element={<AdminScreenshots />} />
                    <Route path="lookups" element={<AdminLookups />} />
                </Route>
            </Routes>
            <DownloadBar />
        </DownloadProvider>
    </BrowserRouter>
)