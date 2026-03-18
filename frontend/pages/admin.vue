<template>
  <div class="admin-page min-h-screen bg-dark-950 text-white">
    <!-- Login screen -->
    <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-screen">
      <div class="w-full max-w-md p-8 rounded-3xl glass">
        <h1 class="font-display font-bold text-3xl text-white mb-2 text-center">Admin</h1>
        <p class="text-dark-400 text-center mb-8">Connectez-vous pour gérer le contenu</p>

        <form @submit.prevent="login">
          <div class="mb-4">
            <label class="block text-dark-400 text-sm mb-2">Mot de passe</label>
            <input
              v-model="password"
              type="password"
              placeholder="Entrez le mot de passe"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 bg-transparent text-white placeholder-dark-600 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/25"
              required
            />
          </div>
          <div v-if="loginError" class="text-red-400 text-sm mb-4">{{ loginError }}</div>
          <button
            type="submit"
            :disabled="loginLoading"
            class="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors duration-300 disabled:opacity-50"
          >
            {{ loginLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <a href="/" class="text-dark-500 text-sm hover:text-primary-400 transition-colors">&larr; Retour au site</a>
        </div>
      </div>
    </div>

    <!-- Dashboard -->
    <div v-else class="flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 bg-dark-900/50 border-r border-white/5 flex flex-col shrink-0">
        <!-- Logo area -->
        <div class="p-5 border-b border-white/5">
          <h1 class="font-display font-bold text-lg text-white">Admin</h1>
          <p class="text-dark-500 text-xs mt-0.5">Gestion du portfolio</p>
        </div>

        <!-- Nav -->
        <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            :class="activeTab === tab.id ? 'bg-primary-500/10 text-primary-400' : 'text-dark-400 hover:bg-white/5 hover:text-dark-200'"
          >
            <component :is="tab.icon" :size="18" />
            {{ tab.label }}
          </button>
        </nav>

        <!-- Sidebar footer -->
        <div class="p-3 border-t border-white/5 space-y-1">
          <button
            @click="toggleMaintenance"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            :class="maintenanceMode ? 'bg-amber-500/10 text-amber-400' : 'text-dark-400 hover:bg-white/5'"
          >
            <span class="w-2 h-2 rounded-full shrink-0" :class="maintenanceMode ? 'bg-amber-400' : 'bg-emerald-400'" />
            {{ maintenanceMode ? 'Maintenance ON' : 'Site en ligne' }}
          </button>
          <a href="/" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-dark-400 hover:bg-white/5 hover:text-dark-200 transition-all">
            <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
            Voir le site
          </a>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top bar -->
        <header class="shrink-0 border-b border-white/5 px-6 py-3 flex items-center justify-between bg-dark-900/30">
          <h2 class="font-display font-semibold text-lg text-white">{{ tabs.find(t => t.id === activeTab)?.label }}</h2>
          <div class="flex items-center gap-3">
            <button @click="showPasswordModal = true" class="text-dark-500 text-xs hover:text-dark-300 transition-colors">Mot de passe</button>
            <button @click="logout" class="px-3 py-1.5 rounded-lg text-xs text-dark-400 hover:bg-white/5 hover:text-white transition-all">Déconnexion</button>
          </div>
        </header>

        <!-- Scrollable content -->
        <main class="flex-1 overflow-y-auto">
          <div class="max-w-4xl mx-auto px-6 py-8">

        <!-- About tab -->
        <div v-if="activeTab === 'about'">
          <div class="admin-card">
            <div class="admin-card-header">
              <h3 class="admin-card-title">Informations personnelles</h3>
              <button @click="saveAbout" :disabled="saving" class="admin-btn-primary">
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
            <div class="admin-card-body space-y-5">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="admin-label">Nom</label>
                  <input v-model="aboutData.name" class="admin-input" />
                </div>
                <div>
                  <label class="admin-label">Titre</label>
                  <input v-model="aboutData.title" class="admin-input" />
                </div>
              </div>
              <div>
                <label class="admin-label">Bio</label>
                <textarea v-model="aboutData.bio" rows="4" class="admin-input" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="admin-label">Localisation</label>
                  <input v-model="aboutData.location" class="admin-input" />
                </div>
                <div>
                  <label class="admin-label">Email</label>
                  <input v-model="aboutData.email" class="admin-input" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="admin-label">GitHub URL</label>
                  <input v-model="aboutData.github" class="admin-input" />
                </div>
                <div>
                  <label class="admin-label">LinkedIn URL</label>
                  <input v-model="aboutData.linkedin" class="admin-input" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills tab -->
        <div v-if="activeTab === 'skills'">
          <div class="flex items-center justify-between mb-6">
            <p class="text-dark-500 text-sm">{{ skillsData.length }} compétence(s)</p>
            <button @click="addSkill" class="admin-btn-primary">+ Ajouter</button>
          </div>
          <div class="space-y-4">
            <div v-for="(skill, i) in skillsData" :key="skill.id || i" class="admin-card">
              <div class="admin-card-body space-y-4">
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label class="admin-label">Nom</label>
                    <input v-model="skill.name" placeholder="Ex : Vue.js" class="admin-input" />
                  </div>
                  <div>
                    <label class="admin-label">Catégorie</label>
                    <select v-model="skill.category" class="admin-select">
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                  </div>
                  <div>
                    <label class="admin-label">Ordre</label>
                    <input v-model.number="skill.sort_order" type="number" placeholder="0" class="admin-input" />
                  </div>
                </div>
                <div>
                  <label class="admin-label">Description (visible sur la page détail)</label>
                  <textarea v-model="skill.description" rows="2" placeholder="Décrivez votre expérience avec cette compétence..." class="admin-input" />
                </div>
                <div class="flex justify-end gap-2 pt-1 border-t border-white/5">
                  <button @click="deleteSkill(skill, i)" class="admin-btn-danger mt-3">Supprimer</button>
                  <button @click="saveSkill(skill)" class="admin-btn-success mt-3">Enregistrer</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Experience tab -->
        <div v-if="activeTab === 'experience'">
          <div class="flex items-center justify-between mb-6">
            <p class="text-dark-500 text-sm">{{ experienceData.length }} expérience(s)</p>
            <button @click="addExperience" class="admin-btn-primary">+ Ajouter</button>
          </div>
          <div class="space-y-4">
            <div v-for="(exp, i) in experienceData" :key="exp.id || i" class="admin-card">
              <div class="admin-card-body space-y-4">
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label class="admin-label">Poste</label>
                    <input v-model="exp.role" placeholder="Ex : Développeur Full-Stack" class="admin-input" />
                  </div>
                  <div>
                    <label class="admin-label">Entreprise</label>
                    <input v-model="exp.company" placeholder="Ex : Acme Inc." class="admin-input" />
                  </div>
                  <div>
                    <label class="admin-label">Période</label>
                    <input v-model="exp.period" placeholder="Ex : 2022 - 2024" class="admin-input" />
                  </div>
                </div>
                <div>
                  <label class="admin-label">Description</label>
                  <textarea v-model="exp.description" placeholder="Décrivez vos missions principales..." rows="3" class="admin-input" />
                </div>
                <div class="flex justify-end gap-2 pt-1 border-t border-white/5">
                  <button @click="deleteExperience(exp, i)" class="admin-btn-danger mt-3">Supprimer</button>
                  <button @click="saveExperience(exp)" class="admin-btn-success mt-3">Enregistrer</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects tab -->
        <div v-if="activeTab === 'projects'">
          <div class="flex items-center justify-between mb-6">
            <p class="text-dark-500 text-sm">{{ projectsData.length }} projet(s)</p>
            <button @click="addProject" class="admin-btn-primary">+ Ajouter</button>
          </div>
          <div class="space-y-4">
            <div v-for="(project, i) in projectsData" :key="project.id || i" class="admin-card">
              <div class="admin-card-body space-y-4">
                <!-- Image preview -->
                <div v-if="project.image" class="rounded-lg overflow-hidden h-32 bg-dark-800">
                  <img :src="project.image" :alt="project.title" class="w-full h-full object-cover" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="admin-label">Titre du projet</label>
                    <input v-model="project.title" placeholder="Ex : Mon application" class="admin-input" />
                  </div>
                  <div>
                    <label class="admin-label">Identifiant (slug)</label>
                    <input v-model="project.slug" placeholder="Ex : mon-application" class="admin-input" />
                  </div>
                </div>
                <div>
                  <label class="admin-label">Description</label>
                  <textarea v-model="project.description" placeholder="Décrivez le projet en quelques lignes..." rows="3" class="admin-input" />
                </div>
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label class="admin-label">Lien GitHub</label>
                    <input v-model="project.github" placeholder="https://github.com/..." class="admin-input" />
                  </div>
                  <div>
                    <label class="admin-label">Lien démo</label>
                    <input v-model="project.demo" placeholder="https://..." class="admin-input" />
                  </div>
                  <div>
                    <label class="admin-label">URL de l'image</label>
                    <input v-model="project.image" placeholder="https://... ou /images/..." class="admin-input" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="admin-label">Technologies (séparées par des virgules)</label>
                    <input v-model="project.tagsString" placeholder="Vue.js, Node.js, TailwindCSS" class="admin-input" />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="admin-label">Ordre</label>
                      <input v-model.number="project.sort_order" type="number" placeholder="0" class="admin-input" />
                    </div>
                    <div class="flex items-end pb-1">
                      <label class="flex items-center gap-2 text-sm text-dark-400 cursor-pointer select-none">
                        <input type="checkbox" v-model="project.featured" class="accent-primary-500 w-4 h-4 rounded" />
                        Mis en avant
                      </label>
                    </div>
                  </div>
                </div>
                <div class="flex justify-end gap-2 pt-1 border-t border-white/5">
                  <button @click="deleteProject(project, i)" class="admin-btn-danger mt-3">Supprimer</button>
                  <button @click="saveProject(project)" class="admin-btn-success mt-3">Enregistrer</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content tab -->
        <div v-if="activeTab === 'content'">
          <div class="flex items-center justify-end mb-6">
            <button @click="saveContent" :disabled="saving" class="admin-btn-primary">
              {{ saving ? 'Enregistrement...' : 'Enregistrer tout' }}
            </button>
          </div>

          <div class="space-y-6">
            <!-- Hero section -->
            <div class="admin-card">
              <div class="admin-card-header"><h3 class="admin-card-title">Section Hero</h3></div>
              <div class="admin-card-body space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div><label class="admin-label">Prénom</label><input v-model="contentData.hero_first_name" class="admin-input" /></div>
                  <div><label class="admin-label">Nom</label><input v-model="contentData.hero_last_name" class="admin-input" /></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div><label class="admin-label">Badge texte</label><input v-model="contentData.hero_badge_text" class="admin-input" /></div>
                  <div><label class="admin-label">Sous-titre</label><input v-model="contentData.hero_subtitle" class="admin-input" /></div>
                </div>
                <div><label class="admin-label">Description</label><textarea v-model="contentData.hero_description" rows="2" class="admin-input" /></div>
                <div class="grid grid-cols-2 gap-4">
                  <div><label class="admin-label">Bouton principal</label><input v-model="contentData.hero_cta_primary" class="admin-input" /></div>
                  <div><label class="admin-label">Bouton secondaire</label><input v-model="contentData.hero_cta_secondary" class="admin-input" /></div>
                </div>
              </div>
            </div>

            <!-- About section -->
            <div class="admin-card">
              <div class="admin-card-header"><h3 class="admin-card-title">Section À propos</h3></div>
              <div class="admin-card-body space-y-4">
                <div class="grid grid-cols-3 gap-4">
                  <div><label class="admin-label">Label section</label><input v-model="contentData.about_section_label" class="admin-input" /></div>
                  <div><label class="admin-label">Titre ligne 1</label><input v-model="contentData.about_heading_line1" class="admin-input" /></div>
                  <div><label class="admin-label">Titre accent</label><input v-model="contentData.about_heading_highlight" class="admin-input" /></div>
                </div>
                <div>
                  <label class="admin-label">Statistiques (JSON)</label>
                  <textarea v-model="contentStatsJson" rows="4" class="admin-input font-mono text-xs" />
                  <p class="text-dark-600 text-xs mt-1">Format : [{"value":"5+","label":"Années d'exp."}]</p>
                </div>
              </div>
            </div>

            <!-- Skills section -->
            <div class="admin-card">
              <div class="admin-card-header"><h3 class="admin-card-title">Section Compétences</h3></div>
              <div class="admin-card-body space-y-4">
                <div class="grid grid-cols-3 gap-4">
                  <div><label class="admin-label">Label</label><input v-model="contentData.skills_section_label" class="admin-input" /></div>
                  <div><label class="admin-label">Titre</label><input v-model="contentData.skills_heading" class="admin-input" /></div>
                  <div><label class="admin-label">Titre accent</label><input v-model="contentData.skills_heading_highlight" class="admin-input" /></div>
                </div>
                <div><label class="admin-label">Sous-titre</label><textarea v-model="contentData.skills_subheading" rows="2" class="admin-input" /></div>
              </div>
            </div>

            <!-- Projects section -->
            <div class="admin-card">
              <div class="admin-card-header"><h3 class="admin-card-title">Section Projets</h3></div>
              <div class="admin-card-body">
                <div class="grid grid-cols-3 gap-4">
                  <div><label class="admin-label">Label</label><input v-model="contentData.projects_section_label" class="admin-input" /></div>
                  <div><label class="admin-label">Titre ligne 1</label><input v-model="contentData.projects_heading_line1" class="admin-input" /></div>
                  <div><label class="admin-label">Titre accent</label><input v-model="contentData.projects_heading_highlight" class="admin-input" /></div>
                </div>
              </div>
            </div>

            <!-- Navbar / Footer -->
            <div class="admin-card">
              <div class="admin-card-header"><h3 class="admin-card-title">Navbar &amp; Footer</h3></div>
              <div class="admin-card-body space-y-4">
                <div class="grid grid-cols-3 gap-4">
                  <div><label class="admin-label">Logo initiales</label><input v-model="contentData.navbar_logo_initials" class="admin-input" /></div>
                  <div><label class="admin-label">Logo texte</label><input v-model="contentData.navbar_logo_text" class="admin-input" /></div>
                  <div><label class="admin-label">Logo suffixe</label><input v-model="contentData.navbar_logo_suffix" class="admin-input" /></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div><label class="admin-label">Copyright nom</label><input v-model="contentData.footer_copyright_name" class="admin-input" /></div>
                  <div><label class="admin-label">Fait par</label><input v-model="contentData.footer_made_by" class="admin-input" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>

          </div>
        </main>
      </div>

      <!-- Toast -->
      <Transition name="toast">
        <div v-if="toast" class="fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-medium shadow-lg z-50 flex items-center gap-2"
          :class="toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'">
          <svg v-if="toast.type === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/></svg>
          {{ toast.message }}
        </div>
      </Transition>

      <!-- Password change modal -->
      <Transition name="modal">
        <div v-if="showPasswordModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showPasswordModal = false">
          <div class="w-full max-w-sm admin-card">
            <div class="admin-card-header"><h3 class="admin-card-title">Changer le mot de passe</h3></div>
            <div class="admin-card-body space-y-4">
              <div>
                <label class="admin-label">Nouveau mot de passe</label>
                <input v-model="newPassword" type="password" placeholder="Minimum 4 caractères" class="admin-input" />
              </div>
              <div class="flex gap-2 pt-2">
                <button @click="changePassword" class="flex-1 admin-btn-primary">Confirmer</button>
                <button @click="showPasswordModal = false" class="flex-1 px-4 py-2 rounded-lg border border-white/10 text-sm text-dark-300 hover:bg-white/5 transition-all">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, User, Layers, Briefcase, FolderKanban } from 'lucide-vue-next'

definePageMeta({ layout: false })

const config = useRuntimeConfig()
const apiUrl = config.public.apiBrowserUrl || 'http://localhost:11501'

const isAuthenticated = ref(false)
const token = ref('')
const password = ref('')
const loginError = ref('')
const loginLoading = ref(false)
const saving = ref(false)
const activeTab = ref('content')
const showPasswordModal = ref(false)
const newPassword = ref('')
const toast = ref<{ message: string; type: string } | null>(null)
const maintenanceMode = ref(false)
const maintenanceMessage = ref('Site en maintenance. Revenez bientôt.')

const tabs = [
  { id: 'content', label: 'Contenu du site', icon: FileText },
  { id: 'about', label: 'À propos', icon: User },
  { id: 'skills', label: 'Compétences', icon: Layers },
  { id: 'experience', label: 'Expérience', icon: Briefcase },
  { id: 'projects', label: 'Projets', icon: FolderKanban },
]

// Data
const aboutData = ref<any>({})
const skillsData = ref<any[]>([])
const experienceData = ref<any[]>([])
const projectsData = ref<any[]>([])
const contentData = ref<Record<string, string>>({})
const contentStatsJson = ref('[]')

async function loadSettings() {
  try {
    const data = await apiFetch('/api/admin/settings')
    maintenanceMode.value = !!data.maintenance_mode
    maintenanceMessage.value = data.maintenance_message || 'Site en maintenance. Revenez bientôt.'
  } catch {}
}

async function toggleMaintenance() {
  const newState = !maintenanceMode.value
  try {
    await apiFetch('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({ maintenance_mode: newState, maintenance_message: maintenanceMessage.value }),
    })
    maintenanceMode.value = newState
    showToast(newState ? 'Mode maintenance activé' : 'Site remis en ligne')
  } catch (e: any) {
    showToast(e.message, 'error')
  }
}

function showToast(message: string, type = 'success') {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 3000)
}

function authHeaders() {
  return { Authorization: `Bearer ${token.value}`, 'Content-Type': 'application/json' }
}

async function apiFetch(path: string, opts: any = {}) {
  const res = await fetch(`${apiUrl}${path}`, {
    ...opts,
    headers: { ...authHeaders(), ...opts.headers },
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// Auth
async function login() {
  loginLoading.value = true
  loginError.value = ''
  try {
    const data = await fetch(`${apiUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value }),
    }).then(r => r.json())

    if (data.token) {
      token.value = data.token
      isAuthenticated.value = true
      localStorage.setItem('admin_token', data.token)
      await loadAllData()
      await loadSettings()
    } else {
      loginError.value = data.error || 'Erreur de connexion'
    }
  } catch {
    loginError.value = 'Erreur réseau'
  }
  loginLoading.value = false
}

function logout() {
  isAuthenticated.value = false
  token.value = ''
  localStorage.removeItem('admin_token')
}

async function changePassword() {
  try {
    const data = await apiFetch('/api/admin/password', {
      method: 'POST',
      body: JSON.stringify({ newPassword: newPassword.value }),
    })
    if (data.token) {
      token.value = data.token
      localStorage.setItem('admin_token', data.token)
    }
    showPasswordModal.value = false
    newPassword.value = ''
    showToast('Mot de passe changé')
  } catch (e: any) {
    showToast(e.message, 'error')
  }
}

// Data loading
async function loadAllData() {
  try {
    const [about, skills, experience, projects, content] = await Promise.all([
      apiFetch('/api/admin/about'),
      apiFetch('/api/admin/skills'),
      apiFetch('/api/admin/experience'),
      apiFetch('/api/admin/projects'),
      apiFetch('/api/admin/content'),
    ])
    aboutData.value = about || {}
    skillsData.value = skills || []
    experienceData.value = experience || []
    projectsData.value = (projects || []).map((p: any) => ({
      ...p,
      tagsString: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
    }))
    contentData.value = content || {}
    contentStatsJson.value = contentData.value.about_stats || '[]'
  } catch (e: any) {
    showToast('Erreur de chargement: ' + e.message, 'error')
  }
}

// Site content
async function saveContent() {
  saving.value = true
  try {
    contentData.value.about_stats = contentStatsJson.value
    await apiFetch('/api/admin/content', {
      method: 'PUT',
      body: JSON.stringify(contentData.value),
    })
    showToast('Contenu du site enregistr\u00e9')
  } catch (e: any) {
    showToast(e.message, 'error')
  }
  saving.value = false
}

function addStat() {
  try {
    const stats = JSON.parse(contentStatsJson.value || '[]')
    stats.push({ value: '', label: '' })
    contentStatsJson.value = JSON.stringify(stats, null, 2)
  } catch {
    contentStatsJson.value = '[{"value":"","label":""}]'
  }
}

// About
async function saveAbout() {
  saving.value = true
  try {
    await apiFetch('/api/admin/about', {
      method: 'PUT',
      body: JSON.stringify(aboutData.value),
    })
    showToast('À propos enregistré')
  } catch (e: any) {
    showToast(e.message, 'error')
  }
  saving.value = false
}

// Skills
function addSkill() {
  skillsData.value.push({ name: '', category: 'Frontend', sort_order: skillsData.value.length })
}

async function saveSkill(skill: any) {
  try {
    if (skill.id) {
      await apiFetch(`/api/admin/skills/${skill.id}`, { method: 'PUT', body: JSON.stringify(skill) })
    } else {
      const data = await apiFetch('/api/admin/skills', { method: 'POST', body: JSON.stringify(skill) })
      skill.id = data.id
    }
    showToast('Compétence enregistrée')
  } catch (e: any) {
    showToast(e.message, 'error')
  }
}

async function deleteSkill(skill: any, index: number) {
  if (skill.id) {
    try {
      await apiFetch(`/api/admin/skills/${skill.id}`, { method: 'DELETE' })
    } catch (e: any) {
      showToast(e.message, 'error')
      return
    }
  }
  skillsData.value.splice(index, 1)
  showToast('Compétence supprimée')
}

// Experience
function addExperience() {
  experienceData.value.push({ role: '', company: '', period: '', description: '', sort_order: experienceData.value.length })
}

async function saveExperience(exp: any) {
  try {
    if (exp.id) {
      await apiFetch(`/api/admin/experience/${exp.id}`, { method: 'PUT', body: JSON.stringify(exp) })
    } else {
      const data = await apiFetch('/api/admin/experience', { method: 'POST', body: JSON.stringify(exp) })
      exp.id = data.id
    }
    showToast('Expérience enregistrée')
  } catch (e: any) {
    showToast(e.message, 'error')
  }
}

async function deleteExperience(exp: any, index: number) {
  if (exp.id) {
    try {
      await apiFetch(`/api/admin/experience/${exp.id}`, { method: 'DELETE' })
    } catch (e: any) {
      showToast(e.message, 'error')
      return
    }
  }
  experienceData.value.splice(index, 1)
  showToast('Expérience supprimée')
}

// Projects
function addProject() {
  projectsData.value.push({
    title: '', slug: '', description: '', tags: [], tagsString: '',
    image: '', github: '', demo: '', featured: false, sort_order: projectsData.value.length,
  })
}

async function saveProject(project: any) {
  const payload = {
    ...project,
    tags: project.tagsString ? project.tagsString.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
  }
  delete payload.tagsString
  try {
    if (project.id) {
      await apiFetch(`/api/admin/projects/${project.id}`, { method: 'PUT', body: JSON.stringify(payload) })
    } else {
      const data = await apiFetch('/api/admin/projects', { method: 'POST', body: JSON.stringify(payload) })
      project.id = data.id
    }
    showToast('Projet enregistré')
  } catch (e: any) {
    showToast(e.message, 'error')
  }
}

async function deleteProject(project: any, index: number) {
  if (project.id) {
    try {
      await apiFetch(`/api/admin/projects/${project.id}`, { method: 'DELETE' })
    } catch (e: any) {
      showToast(e.message, 'error')
      return
    }
  }
  projectsData.value.splice(index, 1)
  showToast('Projet supprimé')
}

// Auto-login from saved token
onMounted(async () => {
  const saved = localStorage.getItem('admin_token')
  if (saved) {
    token.value = saved
    try {
      await apiFetch('/api/admin/about')
      isAuthenticated.value = true
      await loadAllData()
      await loadSettings()
    } catch {
      localStorage.removeItem('admin_token')
    }
  }
})
</script>

<style scoped>
/* ─── Inputs ──────────────────────────────── */
.admin-input {
  @apply w-full px-3 py-2.5 rounded-lg border border-white/10 bg-dark-900 text-white text-sm placeholder-dark-600 focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all;
}

.admin-select {
  @apply w-full px-3 py-2.5 rounded-lg border border-white/10 bg-dark-900 text-white text-sm focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.admin-select option {
  background-color: #1a1a2e;
  color: #fff;
  padding: 8px;
}

/* ─── Labels ──────────────────────────────── */
.admin-label {
  @apply block text-dark-400 text-xs font-medium mb-1.5 uppercase tracking-wider;
}

/* ─── Cards ───────────────────────────────── */
.admin-card {
  @apply rounded-xl border border-white/5 bg-dark-900/50 overflow-hidden;
}
.admin-card-header {
  @apply px-5 py-3.5 border-b border-white/5 flex items-center justify-between bg-dark-900/30;
}
.admin-card-title {
  @apply text-sm font-semibold text-dark-200;
}
.admin-card-body {
  @apply px-5 py-5;
}

/* ─── Buttons ─────────────────────────────── */
.admin-btn-primary {
  @apply px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all disabled:opacity-50 shadow-sm shadow-primary-600/20;
}
.admin-btn-success {
  @apply px-4 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 text-sm font-medium hover:bg-emerald-600/30 border border-emerald-500/10 transition-all;
}
.admin-btn-danger {
  @apply px-4 py-2 rounded-lg bg-red-600/10 text-red-400 text-sm font-medium hover:bg-red-600/20 border border-red-500/10 transition-all;
}

/* ─── Transitions ─────────────────────────── */
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.modal-enter-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.modal-leave-active {
  transition: all 0.2s ease-in;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .admin-card,
.modal-leave-to .admin-card {
  transform: scale(0.95) translateY(10px);
}
</style>

<style>
/* Classic cursor on admin page */
.admin-page,
.admin-page * {
  cursor: auto !important;
}
.admin-page a,
.admin-page button,
.admin-page select,
.admin-page label[for],
.admin-page input[type="checkbox"] {
  cursor: pointer !important;
}
.admin-page input,
.admin-page textarea {
  cursor: text !important;
}
</style>
