// ══════════════════════════════════════════════════════════════════════════════
// DEVELOPER MASTERY HUB — Vue 3 Application
// ══════════════════════════════════════════════════════════════════════════════

const { createApp, ref, computed, onMounted, watch } = Vue;

const app = createApp({
  setup() {
    const currentSubject = ref('menu');
    const isMobileMenuOpen = ref(false);
    const activeIndex = ref(0);
    const activeTab = ref('challenge');
    const toasts = ref([]);
    const userAnswers = ref({});
    const localApiKey = ref('');

    // IA State
    const isAIChatOpen = ref(false);
    const isAIChatLoading = ref(false);
    const isAILoading = ref(false);
    const aiInputText = ref('');
    const aiMessages = ref([]);
    const aiExplanation = ref('');

    // Module catalog
    const modules = ALL_MODULES;

    // Exercise data refs keyed by module
    const exerciseMap = {};
    ALL_MODULES.forEach(mod => {
      exerciseMap[mod.key] = ref([...mod.exercises.map(e => ({ ...e }))]);
    });

    // ─── COMPUTED ────────────────────────────────────────────────────────
    const activeSubjectExercises = computed(() => {
      return exerciseMap[currentSubject.value]?.value || [];
    });

    const activeExercise = computed(() => {
      return activeSubjectExercises.value[activeIndex.value] || activeSubjectExercises.value[0] || { title: '', description: '', stars: 0, inputs: {}, tags: [], codeSnippet: '', completeCode: '', explanationText: '', fileName: '', objective: '', category: '' };
    });

    const currentModuleMeta = computed(() => {
      return ALL_MODULES.find(m => m.key === currentSubject.value) || {};
    });

    const currentModuleName = computed(() => currentModuleMeta.value.name || '');
    const currentModuleColor = computed(() => currentModuleMeta.value.color || 'emerald');

    const activeSubjectProgress = computed(() => getProgress(currentSubject.value));

    const processedChallengeCode = computed(() => {
      let code = activeExercise.value.codeSnippet || '';
      Object.keys(activeExercise.value.inputs || {}).forEach(key => {
        const num = key.replace('INPUT_', '');
        code = code.replace(`[${key}]`, `/* [ Espacio ${num} ] */`);
      });
      return code;
    });

    // ─── PROGRESS ───────────────────────────────────────────────────────
    function getProgress(subject) {
      const list = exerciseMap[subject]?.value;
      if (!list || !list.length) return 0;
      const done = list.filter(e => e.completed).length;
      return Math.round((done / list.length) * 100);
    }

    // ─── PERSISTENCE ────────────────────────────────────────────────────
    onMounted(() => {
      ALL_MODULES.forEach(mod => {
        const saved = localStorage.getItem(`mastery_hub_${mod.key}`);
        if (saved) {
          try {
            const ids = JSON.parse(saved);
            exerciseMap[mod.key].value.forEach(ex => {
              if (ids.includes(ex.id)) ex.completed = true;
            });
          } catch (e) { /* skip corrupt data */ }
        }
      });
      const savedKey = localStorage.getItem('mastery_hub_gemini_key');
      if (savedKey) localApiKey.value = savedKey;
    });

    function saveProgress() {
      const key = `mastery_hub_${currentSubject.value}`;
      const ids = activeSubjectExercises.value.filter(e => e.completed).map(e => e.id);
      localStorage.setItem(key, JSON.stringify(ids));
    }

    function saveLocalApiKey() {
      localStorage.setItem('mastery_hub_gemini_key', localApiKey.value);
      showToast('success', 'Clave de API guardada en localStorage.');
    }

    // ─── NAVIGATION ─────────────────────────────────────────────────────
    function startSubject(subject) {
      currentSubject.value = subject;
      activeIndex.value = 0;
      activeTab.value = 'challenge';
      aiExplanation.value = '';
      aiMessages.value = [];
      resetActiveChallenge();
    }

    function goBackToMenu() {
      currentSubject.value = 'menu';
      isMobileMenuOpen.value = false;
      isAIChatOpen.value = false;
    }

    function selectExercise(index) {
      activeIndex.value = index;
      activeTab.value = 'challenge';
      isMobileMenuOpen.value = false;
      aiExplanation.value = '';
      resetActiveChallenge();
    }

    // ─── CHALLENGE ──────────────────────────────────────────────────────
    function resetActiveChallenge() {
      userAnswers.value = {};
    }

    function checkChallengeAnswer() {
      const answers = activeExercise.value.inputs || {};
      let correct = true;
      let missing = false;

      Object.keys(answers).forEach(key => {
        const expected = String(answers[key]).toLowerCase().trim();
        const userVal = String(userAnswers.value[key] || '').toLowerCase().trim();
        if (!userVal) missing = true;
        if (userVal !== expected) correct = false;
      });

      if (missing) {
        showToast('info', 'Completa todos los campos antes de verificar.');
        return;
      }

      if (correct) {
        activeExercise.value.completed = true;
        saveProgress();
        showToast('success', `¡Correcto! "${activeExercise.value.title}" completado.`);
        activeTab.value = 'code';
      } else {
        showToast('error', 'Incorrecto. Revisa la sintaxis y los métodos.');
      }
    }

    // ─── TOASTS ─────────────────────────────────────────────────────────
    function showToast(type, message) {
      const id = Date.now();
      toasts.value.push({ id, type, message });
      setTimeout(() => dismissToast(id), 3500);
    }

    function dismissToast(id) {
      toasts.value = toasts.value.filter(t => t.id !== id);
    }

    // ─── GEMINI AI ──────────────────────────────────────────────────────
    async function callGemini(prompt, systemInstruction) {
      const apiKey = localApiKey.value || '';
      if (!apiKey) {
        throw new Error('Configura tu API Key de Gemini en el menú principal.');
      }
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const payload = { contents: [{ parts: [{ text: prompt }] }] };
      if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      let delay = 1000;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
          throw new Error('Empty response');
        } catch (err) {
          if (attempt === 3) throw err;
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
        }
      }
    }

    const systemPrompt = computed(() =>
      `Eres un mentor experto de software senior. El alumno Iram te consulta sobre el módulo "${currentModuleName.value}". ` +
      `Ejercicio activo: "${activeExercise.value.title}". ` +
      `Guíalo con pistas valiosas, analogías y el "por qué" técnico. Si el ejercicio no está completado, NO le des la respuesta directa. ` +
      `Conecta siempre con el ecosistema real de Vue 3 + TypeScript + .NET/C# cuando sea relevante.`
    );

    async function getAIExplanation() {
      if (isAILoading.value) return;
      isAILoading.value = true;
      aiExplanation.value = '';
      try {
        const prompt = `Explica con nivel de arquitecto senior este código/concepto:\nMódulo: ${currentModuleName.value}\nEjercicio: ${activeExercise.value.title}\n\n${activeExercise.value.completeCode || activeExercise.value.codeSnippet}\n\nIncluye buenas prácticas y conexión con .NET/C# si aplica.`;
        aiExplanation.value = await callGemini(prompt, systemPrompt.value);
        showToast('success', '✨ Análisis generado.');
      } catch (err) {
        showToast('error', err.message || 'Error al consultar Gemini.');
        aiExplanation.value = 'Error: ' + (err.message || 'Reintenta.');
      } finally {
        isAILoading.value = false;
      }
    }

    async function sendAIMessage() {
      const text = aiInputText.value.trim();
      if (!text || isAIChatLoading.value) return;

      aiMessages.value.push({ id: String(Date.now()), sender: 'user', text });
      aiInputText.value = '';
      isAIChatLoading.value = true;
      scrollChat();

      try {
        const reply = await callGemini(text, systemPrompt.value);
        aiMessages.value.push({ id: String(Date.now() + 1), sender: 'ai', text: reply });
      } catch (err) {
        aiMessages.value.push({ id: String(Date.now() + 1), sender: 'ai', text: 'Error: ' + (err.message || 'Reintenta.') });
      } finally {
        isAIChatLoading.value = false;
        scrollChat();
      }
    }

    async function askPredefined(type) {
      if (isAIChatLoading.value) return;
      const prompts = {
        hint: 'Dame una pista discreta para resolver este ejercicio.',
        concept: 'Explica el concepto teórico detrás de este patrón.',
        dotnet: '¿Cómo se conecta este tema con C# / .NET / ASP.NET Core?'
      };
      aiInputText.value = prompts[type] || '';
      await sendAIMessage();
    }

    function scrollChat() {
      setTimeout(() => {
        const el = document.getElementById('ai-chat-scroller');
        if (el) el.scrollTop = el.scrollHeight;
      }, 60);
    }

    // ─── RETURN ─────────────────────────────────────────────────────────
    return {
      currentSubject, isMobileMenuOpen, activeIndex, activeTab, toasts,
      userAnswers, localApiKey, modules,
      activeSubjectExercises, activeExercise, activeSubjectProgress,
      currentModuleName, currentModuleColor, processedChallengeCode,
      startSubject, goBackToMenu, selectExercise,
      resetActiveChallenge, checkChallengeAnswer, getProgress,
      showToast, dismissToast, saveLocalApiKey,
      isAIChatOpen, isAIChatLoading, isAILoading,
      aiInputText, aiMessages, aiExplanation,
      getAIExplanation, sendAIMessage, askPredefined
    };
  }
});

app.mount('#app');
