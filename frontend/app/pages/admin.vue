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
      <!-- Sidebar -->
      <aside class="fixed top-0 left-0 h-screen w-64 bg-dark-900/50 border-r border-white/5 flex flex-col z-40">
        <!-- Logo area -->
        <div class="p-5 border-b border-white/5">
          <h1 class="font-display font-bold text-lg text-white">Admin</h1>
          <p class="text-dark-500 text-xs mt-0.5">Gestion du portfolio</p>
        </div>

        <!-- Nav -->
        <nav class="flex-1 p-3 overflow-y-auto">
          <!-- Group: Page d'accueil -->
          <p class="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-dark-600">Page d'accueil</p>
          <button
            v-for="item in navHome"
            :key="item.id"
            @click="activeTab = item.id"
            class="nav-item"
            :class="activeTab === item.id ? 'nav-item-active' : 'nav-item-default'"
          >
            <component :is="item.icon" :size="16" />
            {{ item.label }}
          </button>

          <!-- Group: Gestion des données -->
          <p class="px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-dark-600">Gestion des données</p>
          <button
            v-for="item in navData"
            :key="item.id"
            @click="activeTab = item.id"
            class="nav-item"
            :class="activeTab === item.id ? 'nav-item-active' : 'nav-item-default'"
          >
            <component :is="item.icon" :size="16" />
            {{ item.label }}
            <span class="ml-auto text-[10px] tabular-nums opacity-60">{{ item.count }}</span>
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
            <ExternalLink :size="16" />
            Voir le site
          </a>
        </div>
      </aside>

      <!-- Main content -->
      <div class="ml-64">
        <!-- Top bar -->
        <header class="sticky top-0 z-30 border-b border-white/5 px-6 py-3 flex items-center justify-between bg-dark-950/80 backdrop-blur-md">
          <h2 class="font-display font-semibold text-lg text-white">{{ currentTabLabel }}</h2>
          <div class="flex items-center gap-3">
            <button @click="showPasswordModal = true" class="text-dark-500 text-xs hover:text-dark-300 transition-colors">Mot de passe</button>
            <button @click="logout" class="px-3 py-1.5 rounded-lg text-xs text-dark-400 hover:bg-white/5 hover:text-white transition-all">Déconnexion</button>
          </div>
        </header>

        <!-- Content panels -->
        <main>
          <div class="max-w-4xl mx-auto px-6 py-8">

            <!-- ═══════ HOME: HERO ═══════ -->
            <div v-if="activeTab === 'home-hero'" class="space-y-6">
              <div class="admin-card">
                <div class="admin-card-header">
                  <h3 class="admin-card-title">Section Hero</h3>
                  <button @click="saveContent" :disabled="saving" class="admin-btn-primary">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
                </div>
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
            </div>

            <!-- ═══════ HOME: À PROPOS ═══════ -->
            <div v-if="activeTab === 'home-about'" class="space-y-6">
              <!-- Personal info card -->
              <div class="admin-card">
                <div class="admin-card-header">
                  <h3 class="admin-card-title">Informations personnelles</h3>
                  <button @click="saveAbout" :disabled="saving" class="admin-btn-primary">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
                </div>
                <div class="admin-card-body space-y-5">
                  <div class="grid grid-cols-2 gap-4">
                    <div><label class="admin-label">Nom</label><input v-model="aboutData.name" class="admin-input" /></div>
                    <div><label class="admin-label">Titre</label><input v-model="aboutData.title" class="admin-input" /></div>
                  </div>
                  <div><label class="admin-label">Bio</label><textarea v-model="aboutData.bio" rows="4" class="admin-input" /></div>
                  <div class="grid grid-cols-2 gap-4">
                    <div><label class="admin-label">Localisation</label><input v-model="aboutData.location" class="admin-input" /></div>
                    <div><label class="admin-label">Email</label><input v-model="aboutData.email" class="admin-input" /></div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div><label class="admin-label">GitHub URL</label><input v-model="aboutData.github" class="admin-input" /></div>
                    <div><label class="admin-label">LinkedIn URL</label><input v-model="aboutData.linkedin" class="admin-input" /></div>
                  </div>
                </div>
              </div>

              <!-- Section texts card -->
              <div class="admin-card">
                <div class="admin-card-header">
                  <h3 class="admin-card-title">Textes de la section</h3>
                  <button @click="saveContent" :disabled="saving" class="admin-btn-primary">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
                </div>
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
            </div>

            <!-- ═══════ HOME: COMPÉTENCES (section texte) ═══════ -->
            <div v-if="activeTab === 'home-skills'" class="space-y-6">
              <div class="admin-card">
                <div class="admin-card-header">
                  <h3 class="admin-card-title">Textes de la section Compétences</h3>
                  <button @click="saveContent" :disabled="saving" class="admin-btn-primary">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
                </div>
                <div class="admin-card-body space-y-4">
                  <div class="grid grid-cols-3 gap-4">
                    <div><label class="admin-label">Label</label><input v-model="contentData.skills_section_label" class="admin-input" /></div>
                    <div><label class="admin-label">Titre</label><input v-model="contentData.skills_heading" class="admin-input" /></div>
                    <div><label class="admin-label">Titre accent</label><input v-model="contentData.skills_heading_highlight" class="admin-input" /></div>
                  </div>
                  <div><label class="admin-label">Sous-titre</label><textarea v-model="contentData.skills_subheading" rows="2" class="admin-input" /></div>
                </div>
              </div>
              <div class="flex items-center gap-3 px-1 py-2 text-dark-500 text-sm">
                <Info :size="16" class="shrink-0" />
                <span>Les compétences affichées proviennent de l'onglet <button class="text-primary-400 hover:underline" @click="activeTab = 'data-skills'">Gestion → Compétences</button>.</span>
              </div>
            </div>

            <!-- ═══════ HOME: EXPÉRIENCE (section texte + items) ═══════ -->
            <div v-if="activeTab === 'home-experience'" class="space-y-6">
              <!-- Section texts -->
              <div class="admin-card">
                <div class="admin-card-header">
                  <h3 class="admin-card-title">Textes de la section Expérience</h3>
                  <button @click="saveContent" :disabled="saving" class="admin-btn-primary">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
                </div>
                <div class="admin-card-body space-y-4">
                  <div class="grid grid-cols-3 gap-4">
                    <div><label class="admin-label">Label</label><input v-model="contentData.experience_section_label" class="admin-input" /></div>
                    <div><label class="admin-label">Titre</label><input v-model="contentData.experience_heading" class="admin-input" /></div>
                    <div><label class="admin-label">Titre accent</label><input v-model="contentData.experience_heading_highlight" class="admin-input" /></div>
                  </div>
                  <div><label class="admin-label">Sous-titre</label><textarea v-model="contentData.experience_subheading" rows="2" class="admin-input" /></div>
                </div>
              </div>

              <!-- Experience items -->
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-dark-300">Expériences ({{ experienceData.length }})</h3>
                <button @click="addExperience" class="admin-btn-primary">+ Ajouter</button>
              </div>
              <div class="space-y-4">
                <div v-for="(exp, i) in experienceData" :key="exp.id || i" class="admin-card">
                  <div class="admin-card-body space-y-4">
                    <div class="grid grid-cols-3 gap-4">
                      <div><label class="admin-label">Poste</label><input v-model="exp.role" placeholder="Ex : Développeur Full-Stack" class="admin-input" /></div>
                      <div><label class="admin-label">Entreprise</label><input v-model="exp.company" placeholder="Ex : Acme Inc." class="admin-input" /></div>
                      <div><label class="admin-label">Période</label><input v-model="exp.period" placeholder="Ex : 2022 - 2024" class="admin-input" /></div>
                    </div>
                    <div><label class="admin-label">Description</label><textarea v-model="exp.description" placeholder="Décrivez vos missions principales..." rows="3" class="admin-input" /></div>
                    <div class="grid grid-cols-2 gap-4">
                      <div><label class="admin-label">Ordre</label><input v-model.number="exp.sort_order" type="number" placeholder="0" class="admin-input" /></div>
                    </div>
                    <div class="flex justify-end gap-2 pt-1 border-t border-white/5">
                      <button @click="deleteExperience(exp, i)" class="admin-btn-danger mt-3">Supprimer</button>
                      <button @click="saveExperience(exp)" class="admin-btn-success mt-3">Enregistrer</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ═══════ HOME: PROJETS (section texte) ═══════ -->
            <div v-if="activeTab === 'home-projects'" class="space-y-6">
              <div class="admin-card">
                <div class="admin-card-header">
                  <h3 class="admin-card-title">Textes de la section Projets</h3>
                  <button @click="saveContent" :disabled="saving" class="admin-btn-primary">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
                </div>
                <div class="admin-card-body space-y-4">
                  <div class="grid grid-cols-3 gap-4">
                    <div><label class="admin-label">Label</label><input v-model="contentData.projects_section_label" class="admin-input" /></div>
                    <div><label class="admin-label">Titre ligne 1</label><input v-model="contentData.projects_heading_line1" class="admin-input" /></div>
                    <div><label class="admin-label">Titre accent</label><input v-model="contentData.projects_heading_highlight" class="admin-input" /></div>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3 px-1 py-2 text-dark-500 text-sm">
                <Info :size="16" class="shrink-0" />
                <span>Les projets affichés proviennent de l'onglet <button class="text-primary-400 hover:underline" @click="activeTab = 'data-projects'">Gestion → Projets</button>.</span>
              </div>
            </div>


            <!-- ═══════ HOME: NAVBAR & FOOTER ═══════ -->
            <div v-if="activeTab === 'home-navbar'" class="space-y-6">
              <div class="admin-card">
                <div class="admin-card-header">
                  <h3 class="admin-card-title">Navbar</h3>
                  <button @click="saveContent" :disabled="saving" class="admin-btn-primary">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
                </div>
                <div class="admin-card-body">
                  <div class="grid grid-cols-3 gap-4">
                    <div><label class="admin-label">Logo initiales</label><input v-model="contentData.navbar_logo_initials" class="admin-input" /></div>
                    <div><label class="admin-label">Logo texte</label><input v-model="contentData.navbar_logo_text" class="admin-input" /></div>
                    <div><label class="admin-label">Logo suffixe</label><input v-model="contentData.navbar_logo_suffix" class="admin-input" /></div>
                  </div>
                </div>
              </div>
              <div class="admin-card">
                <div class="admin-card-header">
                  <h3 class="admin-card-title">Footer</h3>
                </div>
                <div class="admin-card-body">
                  <div class="grid grid-cols-2 gap-4">
                    <div><label class="admin-label">Copyright nom</label><input v-model="contentData.footer_copyright_name" class="admin-input" /></div>
                    <div><label class="admin-label">Fait par</label><input v-model="contentData.footer_made_by" class="admin-input" /></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ═══════ DATA: COMPÉTENCES ═══════ -->
            <div v-if="activeTab === 'data-skills'">
              <div class="flex items-center justify-between mb-4">
                <p class="text-dark-500 text-sm">{{ skillsData.length }} compétence(s)</p>
                <button @click="addSkill" class="admin-btn-primary">+ Ajouter</button>
              </div>
              <div class="admin-card">
                <div v-for="(skill, i) in skillsData" :key="skill.id || i" class="border-b border-white/5 last:border-b-0">
                  <!-- Compact row -->
                  <div class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02]" @click="toggleExpand('skill', i)">
                    <span class="text-dark-600 text-xs tabular-nums w-6">{{ i + 1 }}</span>
                    <span class="flex-1 text-sm text-white font-medium truncate">{{ skill.name || 'Nouvelle compétence' }}</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider" :class="skill.category === 'Frontend' ? 'bg-blue-500/10 text-blue-400' : skill.category === 'Backend' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'">{{ skill.category || '—' }}</span>
                    <component :is="expandedItem === `skill-${i}` ? ChevronUp : ChevronDown" :size="14" class="text-dark-600" />
                  </div>
                  <!-- Expanded form -->
                  <div v-if="expandedItem === `skill-${i}`" class="px-4 pb-4 space-y-3 bg-dark-900/30">
                    <div class="grid grid-cols-2 gap-3">
                      <div><label class="admin-label">Nom</label><input v-model="skill.name" placeholder="Ex : Vue.js" class="admin-input" /></div>
                      <div>
                        <label class="admin-label">Catégorie</label>
                        <select v-model="skill.category" class="admin-select">
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="DevOps">DevOps</option>
                        </select>
                      </div>
                    </div>
                    <div><label class="admin-label">Description</label><textarea v-model="skill.description" rows="2" placeholder="Décrivez votre expérience..." class="admin-input" /></div>
                    <div class="flex justify-end gap-2">
                      <button @click="deleteSkill(skill, i)" class="admin-btn-danger">Supprimer</button>
                      <button @click="saveSkill(skill)" class="admin-btn-success">Enregistrer</button>
                    </div>
                  </div>
                </div>
                <div v-if="!skillsData.length" class="px-4 py-8 text-center text-dark-600 text-sm">Aucune compétence. Cliquez sur « + Ajouter » pour commencer.</div>
              </div>
            </div>

            <!-- ═══════ DATA: PROJETS ═══════ -->
            <div v-if="activeTab === 'data-projects'">
              <div class="flex items-center justify-between mb-4">
                <p class="text-dark-500 text-sm">{{ projectsData.length }} projet(s)</p>
                <button @click="addProject" class="admin-btn-primary">+ Ajouter</button>
              </div>
              <div class="admin-card">
                <div v-for="(project, i) in projectsData" :key="project.id || i" class="border-b border-white/5 last:border-b-0">
                  <!-- Compact row -->
                  <div class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02]" @click="toggleExpand('project', i)">
                    <div v-if="project.image" class="w-10 h-10 rounded-lg overflow-hidden bg-dark-800 shrink-0"><img :src="project.image" class="w-full h-full object-cover" /></div>
                    <div v-else class="w-10 h-10 rounded-lg bg-dark-800 shrink-0 flex items-center justify-center text-dark-600 text-xs">{{ i + 1 }}</div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-white font-medium truncate">{{ project.title || 'Nouveau projet' }}</p>
                      <p class="text-xs text-dark-500 truncate">{{ projectSkillNames(project) || 'Aucune technologie' }}</p>
                    </div>
                    <span v-if="project.featured" class="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 text-[10px] font-medium">Featured</span>
                    <component :is="expandedItem === `project-${i}` ? ChevronUp : ChevronDown" :size="14" class="text-dark-600" />
                  </div>
                  <!-- Expanded form -->
                  <div v-if="expandedItem === `project-${i}`" class="px-4 pb-4 space-y-3 bg-dark-900/30">
                    <div class="grid grid-cols-2 gap-3">
                      <div><label class="admin-label">Titre</label><input v-model="project.title" placeholder="Ex : Mon application" class="admin-input" /></div>
                      <div><label class="admin-label">Slug</label><input v-model="project.slug" placeholder="Ex : mon-application" class="admin-input" /></div>
                    </div>
                    <div><label class="admin-label">Description</label><textarea v-model="project.description" rows="2" class="admin-input" /></div>
                    <div class="grid grid-cols-2 gap-3">
                      <div><label class="admin-label">GitHub</label><input v-model="project.github" placeholder="https://github.com/..." class="admin-input" /></div>
                      <div><label class="admin-label">Démo</label><input v-model="project.demo" placeholder="https://..." class="admin-input" /></div>
                    </div>
                    <!-- Technologies (= skills multi-select) -->
                    <div>
                      <label class="admin-label">Technologies</label>
                      <div class="flex flex-wrap gap-2 p-3 rounded-lg border border-white/10 bg-dark-900 max-h-40 overflow-y-auto">
                        <label
                          v-for="skill in skillsData"
                          :key="skill.id"
                          class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs cursor-pointer select-none transition-all"
                          :class="(project.skill_ids || []).includes(skill.id) ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'bg-white/5 text-dark-400 border border-transparent hover:bg-white/10'"
                        >
                          <input
                            type="checkbox"
                            :checked="(project.skill_ids || []).includes(skill.id)"
                            class="hidden"
                            @change="toggleProjectSkill(project, skill.id)"
                          />
                          {{ skill.name }}
                        </label>
                        <p v-if="!skillsData.length" class="text-dark-600 text-xs">Ajoutez d'abord des compétences dans Gestion → Compétences.</p>
                      </div>
                    </div>

                    <!-- Main image upload -->
                    <div>
                      <label class="admin-label">Image principale</label>
                      <div class="flex items-center gap-3">
                        <div v-if="project.image" class="w-20 h-14 rounded-lg overflow-hidden bg-dark-800 shrink-0">
                          <img :src="project.image" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 flex items-center gap-2">
                          <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-dark-900 text-sm text-dark-300 hover:bg-dark-800 cursor-pointer transition-all">
                            <Upload :size="14" />
                            <span>{{ uploading ? 'Envoi...' : 'Uploader' }}</span>
                            <input type="file" accept="image/*" class="hidden" @change="(e: any) => uploadProjectImage(e, project)" :disabled="uploading" />
                          </label>
                          <input v-model="project.image" placeholder="ou URL directe..." class="admin-input flex-1" />
                        </div>
                      </div>
                    </div>

                    <!-- Gallery images -->
                    <div>
                      <label class="admin-label">Images supplémentaires (galerie)</label>
                      <div class="space-y-2">
                        <div v-for="(img, imgIdx) in (project.images || [])" :key="img.id || imgIdx" class="flex items-center gap-2">
                          <div class="w-16 h-11 rounded-lg overflow-hidden bg-dark-800 shrink-0">
                            <img :src="img.url" class="w-full h-full object-cover" />
                          </div>
                          <input v-model="img.caption" placeholder="Légende (optionnel)" class="admin-input flex-1 text-xs" />
                          <button @click="removeGalleryImage(project, img, imgIdx)" class="text-red-400 hover:text-red-300 text-xs px-2 py-1">✕</button>
                        </div>
                        <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-white/10 bg-dark-900/50 text-sm text-dark-400 hover:bg-dark-800 cursor-pointer transition-all w-fit">
                          <Upload :size="14" />
                          <span>{{ uploading ? 'Envoi...' : 'Ajouter une image' }}</span>
                          <input type="file" accept="image/*" class="hidden" @change="(e: any) => uploadGalleryImage(e, project)" :disabled="uploading" />
                        </label>
                      </div>
                    </div>

                    <div class="flex items-center justify-between pt-1">
                      <label class="flex items-center gap-2 text-sm text-dark-400 cursor-pointer select-none">
                        <input type="checkbox" v-model="project.featured" class="accent-primary-500 w-4 h-4 rounded" />
                        Mis en avant sur la home
                      </label>
                      <div class="flex gap-2">
                        <button @click="deleteProject(project, i)" class="admin-btn-danger">Supprimer</button>
                        <button @click="saveProject(project)" class="admin-btn-success">Enregistrer</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="!projectsData.length" class="px-4 py-8 text-center text-dark-600 text-sm">Aucun projet. Cliquez sur « + Ajouter » pour commencer.</div>
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
import { Sparkles, User, Layers, Briefcase, FolderKanban, PanelTop, ExternalLink, Info, ChevronDown, ChevronUp, Upload } from 'lucide-vue-next'

definePageMeta({ layout: false })

const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl || 'http://localhost:11501'

const isAuthenticated = ref(false)
const token = ref('')
const password = ref('')
const loginError = ref('')
const loginLoading = ref(false)
const saving = ref(false)
const activeTab = ref('home-hero')
const showPasswordModal = ref(false)
const newPassword = ref('')
const toast = ref<{ message: string; type: string } | null>(null)
const maintenanceMode = ref(false)
const maintenanceMessage = ref('Site en maintenance. Revenez bientôt.')
const expandedItem = ref<string | null>(null)
const uploading = ref(false)

function toggleExpand(type: string, index: number) {
  const key = `${type}-${index}`
  expandedItem.value = expandedItem.value === key ? null : key
}

// Navigation
const navHome = [
  { id: 'home-hero', label: 'Hero', icon: Sparkles },
  { id: 'home-about', label: 'À propos', icon: User },
  { id: 'home-skills', label: 'Compétences', icon: Layers },
  { id: 'home-experience', label: 'Expérience', icon: Briefcase },
  { id: 'home-projects', label: 'Projets', icon: FolderKanban },
  { id: 'home-navbar', label: 'Navbar & Footer', icon: PanelTop },
]

const navData = computed(() => [
  { id: 'data-skills', label: 'Compétences', icon: Layers, count: skillsData.value.length },
  { id: 'data-projects', label: 'Projets', icon: FolderKanban, count: projectsData.value.length },
])

const currentTabLabel = computed(() => {
  const all = [...navHome, ...navData.value]
  const found = all.find(t => t.id === activeTab.value)
  if (!found) return ''
  const prefix = activeTab.value.startsWith('home-') ? 'Accueil → ' : 'Gestion → '
  return prefix + found.label
})

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
    projectsData.value = (projects || []).map((p: any) => ({ ...p }))
    contentData.value = content || {}
    // Pre-fill defaults for empty content keys
    const defaults: Record<string, string> = {
      hero_first_name: 'Jérémy', hero_last_name: 'Duc',
      hero_badge_text: 'Étudiant ESCEN TECH | Alternant chez LesBonsTech',
      hero_subtitle: 'Développeur Web Full-Stack',
      experience_section_label: 'Parcours', experience_heading: 'Mon',
      experience_heading_highlight: 'expérience', experience_subheading: 'Un parcours riche en apprentissages et en défis techniques.',
      skills_section_label: 'Compétences', skills_heading: 'Mes',
      skills_heading_highlight: 'compétences', skills_subheading: 'Les technologies et outils que je maîtrise.',
      projects_section_label: 'Projets', projects_heading_line1: 'Mes réalisations',
      projects_heading_highlight: 'récentes',
      about_section_label: 'À propos', about_heading_line1: 'Qui',
      about_heading_highlight: 'suis-je ?',
    }
    for (const [k, v] of Object.entries(defaults)) {
      if (!contentData.value[k]) contentData.value[k] = v
    }
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
    showToast('Contenu enregistré')
  } catch (e: any) {
    showToast(e.message, 'error')
  }
  saving.value = false
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
  skillsData.value.push({ name: '', category: 'Frontend', level: 50, description: '', sort_order: skillsData.value.length })
  expandedItem.value = `skill-${skillsData.value.length - 1}`
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
    title: '', slug: '', description: '',
    image: '', github: '', demo: '', featured: false, sort_order: projectsData.value.length,
    skill_ids: [], images: [],
  })
  expandedItem.value = `project-${projectsData.value.length - 1}`
}

function toggleProjectSkill(project: any, skillId: number) {
  if (!project.skill_ids) project.skill_ids = []
  const idx = project.skill_ids.indexOf(skillId)
  if (idx >= 0) project.skill_ids.splice(idx, 1)
  else project.skill_ids.push(skillId)
}

function projectSkillNames(project: any): string {
  if (!project.skill_ids?.length) return ''
  return skillsData.value
    .filter((s: any) => project.skill_ids.includes(s.id))
    .map((s: any) => s.name)
    .join(', ')
}

async function uploadProjectImage(event: Event, project: any) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', input.files[0])
    const res = await fetch(`${apiUrl}/api/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: formData,
    })
    const data = await res.json()
    if (data.url) {
      project.image = `${apiUrl}${data.url}`
      showToast('Image uploadée')
    } else {
      showToast(data.error || 'Erreur upload', 'error')
    }
  } catch (e: any) {
    showToast(e.message, 'error')
  }
  uploading.value = false
  input.value = ''
}

async function uploadGalleryImage(event: Event, project: any) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', input.files[0])
    const res = await fetch(`${apiUrl}/api/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: formData,
    })
    const data = await res.json()
    if (data.url) {
      const url = `${apiUrl}${data.url}`
      if (!project.images) project.images = []
      // If project is already saved, persist to DB immediately
      if (project.id) {
        const imgData = await apiFetch(`/api/admin/projects/${project.id}/images`, {
          method: 'POST',
          body: JSON.stringify({ url, caption: '' }),
        })
        project.images.push({ id: imgData.id, url, caption: '', sort_order: project.images.length })
      } else {
        project.images.push({ url, caption: '', sort_order: project.images.length })
      }
      showToast('Image ajoutée')
    } else {
      showToast(data.error || 'Erreur upload', 'error')
    }
  } catch (e: any) {
    showToast(e.message, 'error')
  }
  uploading.value = false
  input.value = ''
}

async function removeGalleryImage(project: any, img: any, index: number) {
  if (project.id && img.id) {
    try {
      await apiFetch(`/api/admin/projects/${project.id}/images/${img.id}`, { method: 'DELETE' })
    } catch (e: any) {
      showToast(e.message, 'error')
      return
    }
  }
  project.images.splice(index, 1)
  showToast('Image supprimée')
}

async function saveProject(project: any) {
  const payload = { ...project }
  delete payload.images
  try {
    if (project.id) {
      await apiFetch(`/api/admin/projects/${project.id}`, { method: 'PUT', body: JSON.stringify(payload) })
    } else {
      const data = await apiFetch('/api/admin/projects', { method: 'POST', body: JSON.stringify(payload) })
      project.id = data.id
      // Save pending gallery images
      if (project.images?.length) {
        for (const img of project.images) {
          const imgData = await apiFetch(`/api/admin/projects/${project.id}/images`, {
            method: 'POST',
            body: JSON.stringify({ url: img.url, caption: img.caption || '' }),
          })
          img.id = imgData.id
        }
      }
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
@reference "~/assets/css/main.css";
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

/* ─── Nav items ───────────────────────────── */
.nav-item {
  @apply w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all;
}
.nav-item-active {
  @apply bg-primary-500/10 text-primary-400;
}
.nav-item-default {
  @apply text-dark-400 hover:bg-white/5 hover:text-dark-200;
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
