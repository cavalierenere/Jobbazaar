// projectEstimator.js
(function() {
  const i18n = window.i18n || {en: {}, fa: {}};
  const lang = (window.currentLang || 'en');
  const t = (key) => {
    const keys = key.split('.');
    let val = i18n[lang];
    for (let k of keys) val = val && val[k];
    return val || key;
  };

  const formContainer = document.getElementById('project-estimator-form-container');
  let step = 1;
  let formData = {
    projectType: '',
    projectTypeOther: '',
    details: {},
    postcode: ''
  };

  const projectOptions = [
    {key: 'kitchen', label: t('projectEstimator.options.kitchen')},
    {key: 'bathroom', label: t('projectEstimator.options.bathroom')},
    {key: 'loft', label: t('projectEstimator.options.loft')},
    {key: 'extension', label: t('projectEstimator.options.extension')},
    {key: 'refurb', label: t('projectEstimator.options.refurb')},
    {key: 'newbuild', label: t('projectEstimator.options.newbuild')},
    {key: 'other', label: t('projectEstimator.options.other')}
  ];

  const detailQuestions = {
    kitchen: [
      {name: 'rooms', label: 'How many kitchens?', type: 'number', min: 1, max: 5, placeholder: '1'},
      {name: 'size', label: 'Approximate size (sqm)', type: 'number', min: 5, max: 100, placeholder: '20'}
    ],
    bathroom: [
      {name: 'rooms', label: 'How many bathrooms?', type: 'number', min: 1, max: 5, placeholder: '1'},
      {name: 'size', label: 'Approximate size (sqm)', type: 'number', min: 3, max: 50, placeholder: '8'}
    ],
    loft: [
      {name: 'rooms', label: 'Number of rooms to convert', type: 'number', min: 1, max: 4, placeholder: '1'},
      {name: 'size', label: 'Approximate area (sqm)', type: 'number', min: 10, max: 80, placeholder: '25'}
    ],
    extension: [
      {name: 'size', label: 'Extension size (sqm)', type: 'number', min: 5, max: 100, placeholder: '20'}
    ],
    refurb: [
      {name: 'rooms', label: 'Number of rooms', type: 'number', min: 1, max: 20, placeholder: '5'},
      {name: 'size', label: 'Total area (sqm)', type: 'number', min: 20, max: 500, placeholder: '100'}
    ],
    newbuild: [
      {name: 'rooms', label: 'Number of rooms', type: 'number', min: 1, max: 20, placeholder: '8'},
      {name: 'size', label: 'Total area (sqm)', type: 'number', min: 30, max: 1000, placeholder: '150'}
    ],
    other: [
      {name: 'details', label: 'Describe your project', type: 'text', placeholder: 'Project details'}
    ]
  };

  function renderStep1() {
    formContainer.innerHTML = `
      <form id="estimator-step1">
        <div class="estimator-step-title">${t('projectEstimator.step1Title')}</div>
        <div class="estimator-options">
          ${projectOptions.map(opt => `
            <label class="estimator-option">
              <input type="radio" name="projectType" value="${opt.key}" ${formData.projectType === opt.key ? 'checked' : ''}>
              <span>${opt.label}</span>
            </label>
          `).join('')}
        </div>
        <div id="other-project-type" style="display:${formData.projectType === 'other' ? 'block' : 'none'};margin-top:0.5em;">
          <input type="text" name="projectTypeOther" placeholder="${t('projectEstimator.options.otherPlaceholder')}" value="${formData.projectTypeOther || ''}" />
        </div>
        <button type="button" class="estimator-next-btn">${t('projectEstimator.next')}</button>
      </form>
    `;
    const radios = formContainer.querySelectorAll('input[name="projectType"]');
    radios.forEach(radio => {
      radio.addEventListener('change', function() {
        formData.projectType = this.value;
        renderStep1();
      });
    });
    const otherInput = formContainer.querySelector('input[name="projectTypeOther"]');
    if (otherInput) {
      otherInput.addEventListener('input', function() {
        formData.projectTypeOther = this.value;
      });
    }
    formContainer.querySelector('.estimator-next-btn').onclick = function() {
      if (!formData.projectType) return;
      step = 2;
      renderStep2();
    };
  }

  function renderStep2() {
    const type = formData.projectType;
    const questions = detailQuestions[type] || [];
    formContainer.innerHTML = `
      <form id="estimator-step2">
        <div class="estimator-step-title">${t('projectEstimator.step2Title')}</div>
        ${questions.map(q => `
          <div class="estimator-field">
            <label>${q.label}</label>
            <input type="${q.type}" name="${q.name}" min="${q.min||''}" max="${q.max||''}" placeholder="${q.placeholder||''}" value="${formData.details[q.name]||''}" />
          </div>
        `).join('')}
        <div class="estimator-actions">
          <button type="button" class="estimator-back-btn">${t('projectEstimator.back')}</button>
          <button type="button" class="estimator-next-btn">${t('projectEstimator.next')}</button>
        </div>
      </form>
    `;
    questions.forEach(q => {
      const input = formContainer.querySelector(`[name="${q.name}"]`);
      if (input) {
        input.addEventListener('input', function() {
          formData.details[q.name] = this.value;
        });
      }
    });
    formContainer.querySelector('.estimator-back-btn').onclick = function() {
      step = 1;
      renderStep1();
    };
    formContainer.querySelector('.estimator-next-btn').onclick = function() {
      step = 3;
      renderStep3();
    };
  }

  function renderStep3() {
    formContainer.innerHTML = `
      <form id="estimator-step3">
        <div class="estimator-step-title">${t('projectEstimator.step3Title')}</div>
        <input type="text" name="postcode" placeholder="${t('projectEstimator.postcodePlaceholder')}" value="${formData.postcode||''}" />
        <div class="estimator-actions">
          <button type="button" class="estimator-back-btn">${t('projectEstimator.back')}</button>
          <button type="submit" class="estimator-submit-btn">${t('projectEstimator.submit')}</button>
        </div>
      </form>
    `;
    formContainer.querySelector('input[name="postcode"]').addEventListener('input', function() {
      formData.postcode = this.value;
    });
    formContainer.querySelector('.estimator-back-btn').onclick = function() {
      step = 2;
      renderStep2();
    };
    formContainer.querySelector('#estimator-step3').onsubmit = function(e) {
      e.preventDefault();
      renderResult();
    };
  }

  function mockEstimate() {
    // Simple mock logic based on type and size
    let base = 0, valueInc = 0;
    const type = formData.projectType;
    const size = parseInt(formData.details.size) || 20;
    switch(type) {
      case 'kitchen': base = 12000 + size*400; valueInc = 8000 + size*200; break;
      case 'bathroom': base = 8000 + size*500; valueInc = 5000 + size*150; break;
      case 'loft': base = 25000 + size*350; valueInc = 15000 + size*180; break;
      case 'extension': base = 18000 + size*350; valueInc = 12000 + size*120; break;
      case 'refurb': base = 30000 + size*200; valueInc = 20000 + size*100; break;
      case 'newbuild': base = 120000 + size*250; valueInc = 60000 + size*120; break;
      default: base = 15000; valueInc = 8000;
    }
    return {
      cost: Math.round(base/100)*100,
      value: Math.round(valueInc/100)*100
    };
  }

  function renderResult() {
    const est = mockEstimate();
    formContainer.innerHTML = `
      <div class="estimator-result">
        <div class="estimator-step-title">${t('projectEstimator.resultTitle')}</div>
        <div class="estimator-result-row">
          <span>${t('projectEstimator.estimatedCost')}:</span>
          <strong>${t('projectEstimator.currency')}${est.cost.toLocaleString()}</strong>
        </div>
        <div class="estimator-result-row">
          <span>${t('projectEstimator.estimatedValue')}:</span>
          <strong>${t('projectEstimator.currency')}${est.value.toLocaleString()}</strong>
        </div>
        <div class="estimator-result-message">
          ${t('projectEstimator.homeValueMessage')} <strong>${t('projectEstimator.currency')}${est.value.toLocaleString()}</strong>
        </div>
        <button type="button" class="estimator-restart-btn">${t('projectEstimator.restart')}</button>
      </div>
    `;
    formContainer.querySelector('.estimator-restart-btn').onclick = function() {
      step = 1;
      formData = {projectType: '', projectTypeOther: '', details: {}, postcode: ''};
      renderStep1();
    };
  }

  // Initial render
  renderStep1();

  // Expose for future backend integration
  window.projectEstimator = {
    getFormData: () => ({...formData}),
    getEstimate: mockEstimate,
    reset: () => { step = 1; formData = {projectType: '', projectTypeOther: '', details: {}, postcode: ''}; renderStep1(); }
  };
})(); 