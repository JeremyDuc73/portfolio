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
    <div v-else>
      <!-- Top bar -->
      <header class="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="font-display font-bold text-xl">Admin Dashboard</h1>
          <a href="/" class="text-dark-500 text-sm hover:text-primary-400 transition-colors">&larr; Voir le site</a>
        </div>
        <div class="flex items-center gap-4">
          <!-- Maintenance toggle -->
          <button
            @click="toggleMaintenance"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            :class="maintenanceMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'glass text-dark-400 hover:text-dark-300'"
          >
            <span class="w-2 h-2 rounded-full" :class="maintenanceMode ? 'bg-amber-400' : 'bg-emerald-400'" />
            {{ maintenanceMode ? 'Maintenance activée' : 'Site en ligne' }}
          </button>
          <button @click="showPasswordModal = true" class="text-dark-400 text-sm hover:text-primary-400 transition-colors">
            Changer mot de passe
          </button>
          <button @click="logout" class="px-4 py-2 rounded-lg glass text-sm text-dark-300 hover:text-white transition-colors">
            Déconnexion
          </button>
        </div>
      </header>

      <!-- Tabs -->
      <div class="border-b border-white/5 px-6">
        <nav class="flex gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-4 py-3 text-sm font-medium transition-colors relative"
            :class="activeTab === tab.id ? 'text-primary-400' : 'text-dark-500 hover:text-dark-300'"
          >
            {{ tab.label }}
            <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
          </button>
        </nav>
      </div>

      <!-- Content area -->
      <main class="max-w-5xl mx-auto px-6 py-8">
        <!-- About tab -->
        <div v-if="activeTab === 'about'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-display font-bold text-2xl">À propos</h2>
            <button @click="saveAbout" :disabled="saving" class="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-sm font-medium transition-colors disabled:opacity-50">
              {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-dark-400 text-sm mb-1">Nom</label>
                <input v-model="aboutData.name" class="admin-input" />
              </div>
              <div>
                <label class="block text-dark-400 text-sm mb-1">Titre</label>
                <input v-model="aboutData.title" class="admin-input" />
              </div>
            </div>
            <div>
              <label class="block text-dark-400 text-sm mb-1">Bio</label>
              <textarea v-model="aboutData.bio" rows="4" class="admin-input" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-dark-400 text-sm mb-1">Localisation</label>
                <input v-model="aboutData.location" class="admin-input" />
              </div>
              <div>
                <label class="block text-dark-400 text-sm mb-1">Email</label>
                <input v-model="aboutData.email" class="admin-input" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-dark-400 text-sm mb-1">GitHub URL</label>
                <input v-model="aboutData.github" class="admin-input" />
              </div>
              <div>
                <label class="block text-dark-400 text-sm mb-1">LinkedIn URL</label>
                <input v-model="aboutData.linkedin" class="admin-input" />
              </div>
            </div>
          </div>
        </div>

        <!-- Skills tab -->
        <div v-if="activeTab === 'skills'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-display font-bold text-2xl">Compétences</h2>
            <button @click="addSkill" class="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-sm font-medium transition-colors">
              + Ajouter une compétence
            </button>
          </div>
          <div class="space-y-3">
            <div v-for="(skill, i) in skillsData" :key="skill.id || i" class="flex items-center gap-4 p-4 rounded-xl glass">
              <div class="flex-1">
                <label class="block text-dark-500 text-xs mb-1">Nom</label>
                <input v-model="skill.name" placeholder="Ex : Vue.js" class="admin-input" />
              </div>
              <div class="w-40">
                <label class="block text-dark-500 text-xs mb-1">Catégorie</label>
                <select v-model="skill.category" class="admin-input">
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>
              <div class="flex items-end gap-2 pt-4">
                <button @click="saveSkill(skill)" class="px-3 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 text-xs hover:bg-emerald-600/30 transition-colors">Enregistrer</button>
                <button @click="deleteSkill(skill, i)" class="px-3 py-2 rounded-lg bg-red-600/20 text-red-400 text-xs hover:bg-red-600/30 transition-colors">Supprimer</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Experience tab -->
        <div v-if="activeTab === 'experience'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-display font-bold text-2xl">Expérience</h2>
            <button @click="addExperience" class="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-sm font-medium transition-colors">
              + Ajouter une expérience
            </button>
          </div>
          <div class="space-y-4">
            <div v-for="(exp, i) in experienceData" :key="exp.id || i" class="p-5 rounded-xl glass space-y-4">
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-dark-500 text-xs mb-1">Poste</label>
                  <input v-model="exp.role" placeholder="Ex : Développeur Full-Stack" class="admin-input" />
                </div>
                <div>
                  <label class="block text-dark-500 text-xs mb-1">Entreprise</label>
                  <input v-model="exp.company" placeholder="Ex : Acme Inc." class="admin-input" />
                </div>
                <div>
                  <label class="block text-dark-500 text-xs mb-1">Période</label>
                  <input v-model="exp.period" placeholder="Ex : 2022 - 2024" class="admin-input" />
                </div>
              </div>
              <div>
                <label class="block text-dark-500 text-xs mb-1">Description</label>
                <textarea v-model="exp.description" placeholder="Décrivez vos missions principales..." rows="3" class="admin-input" />
              </div>
              <div class="flex justify-end gap-2 pt-1">
                <button @click="saveExperience(exp)" class="px-4 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 text-sm hover:bg-emerald-600/30 transition-colors">Enregistrer</button>
                <button @click="deleteExperience(exp, i)" class="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 text-sm hover:bg-red-600/30 transition-colors">Supprimer</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects tab -->
        <div v-if="activeTab === 'projects'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-display font-bold text-2xl">Projets</h2>
            <button @click="addProject" class="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-sm font-medium transition-colors">
              + Ajouter un projet
            </button>
          </div>
          <div class="space-y-6">
            <div v-for="(project, i) in projectsData" :key="project.id || i" class="p-5 rounded-xl glass space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-dark-500 text-xs mb-1">Titre du projet</label>
                  <input v-model="project.title" placeholder="Ex : Mon application" class="admin-input" />
                </div>
                <div>
                  <label class="block text-dark-500 text-xs mb-1">Identifiant (slug)</label>
                  <input v-model="project.slug" placeholder="Ex : mon-application" class="admin-input" />
                </div>
              </div>
              <div>
                <label class="block text-dark-500 text-xs mb-1">Description</label>
                <textarea v-model="project.description" placeholder="Décrivez le projet en quelques lignes..." rows="3" class="admin-input" />
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-dark-500 text-xs mb-1">Lien GitHub</label>
                  <input v-model="project.github" placeholder="https://github.com/..." class="admin-input" />
                </div>
                <div>
                  <label class="block text-dark-500 text-xs mb-1">Lien démo</label>
                  <input v-model="project.demo" placeholder="https://..." class="admin-input" />
                </div>
                <div>
                  <label class="block text-dark-500 text-xs mb-1">URL de l'image</label>
                  <input v-model="project.image" placeholder="/images/projet.jpg" class="admin-input" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-dark-500 text-xs mb-1">Technologies (séparées par des virgules)</label>
                  <input v-model="project.tagsString" placeholder="Vue.js, Node.js, TailwindCSS" class="admin-input" />
                </div>
                <div class="flex items-end gap-4">
                  <label class="flex items-center gap-2 text-sm text-dark-400 pb-2">
                    <input type="checkbox" v-model="project.featured" class="accent-primary-500 w-4 h-4" />
                    Mis en avant
                  </label>
                  <div class="flex-1">
                    <label class="block text-dark-500 text-xs mb-1">Ordre d'affichage</label>
                    <input v-model.number="project.sort_order" type="number" placeholder="0" class="admin-input" />
                  </div>
                </div>
              </div>
              <div class="flex justify-end gap-2 pt-1">
                <button @click="saveProject(project)" class="px-4 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 text-sm hover:bg-emerald-600/30 transition-colors">Enregistrer</button>
                <button @click="deleteProject(project, i)" class="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 text-sm hover:bg-red-600/30 transition-colors">Supprimer</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Status toast -->
        <div v-if="toast" class="fixed bottom-6 right-6 px-4 py-3 rounded-xl text-sm font-medium animate-pulse z-50" :class="toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'">
          {{ toast.message }}
        </div>
      </main>

      <!-- Password change modal -->
      <div v-if="showPasswordModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showPasswordModal = false">
        <div class="w-full max-w-sm p-6 rounded-2xl glass">
          <h3 class="font-display font-bold text-lg mb-4">Changer le mot de passe</h3>
          <input v-model="newPassword" type="password" placeholder="Nouveau mot de passe" class="admin-input mb-3" />
          <div class="flex gap-2">
            <button @click="changePassword" class="flex-1 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-sm font-medium transition-colors">Changer</button>
            <button @click="showPasswordModal = false" class="flex-1 py-2 rounded-lg glass text-sm transition-colors">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const config = useRuntimeConfig()
const apiUrl = config.public.apiBrowserUrl || 'http://localhost:11501'

const isAuthenticated = ref(false)
const token = ref('')
const password = ref('')
const loginError = ref('')
const loginLoading = ref(false)
const saving = ref(false)
const activeTab = ref('about')
const showPasswordModal = ref(false)
const newPassword = ref('')
const toast = ref<{ message: string; type: string } | null>(null)
const maintenanceMode = ref(false)
const maintenanceMessage = ref('Site en maintenance. Revenez bientôt.')

const tabs = [
  { id: 'about', label: 'À propos' },
  { id: 'skills', label: 'Compétences' },
  { id: 'experience', label: 'Expérience' },
  { id: 'projects', label: 'Projets' },
]

// Data
const aboutData = ref<any>({})
const skillsData = ref<any[]>([])
const experienceData = ref<any[]>([])
const projectsData = ref<any[]>([])

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
    const [about, skills, experience, projects] = await Promise.all([
      apiFetch('/api/admin/about'),
      apiFetch('/api/admin/skills'),
      apiFetch('/api/admin/experience'),
      apiFetch('/api/admin/projects'),
    ])
    aboutData.value = about || {}
    skillsData.value = skills || []
    experienceData.value = experience || []
    projectsData.value = (projects || []).map((p: any) => ({
      ...p,
      tagsString: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
    }))
  } catch (e: any) {
    showToast('Erreur de chargement: ' + e.message, 'error')
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
.admin-input {
  @apply w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm placeholder-dark-600 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/25 transition-all;
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
