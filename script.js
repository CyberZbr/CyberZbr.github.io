// 标签切换
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    panels.forEach(panel => {
      if (panel.id === tab.dataset.tab) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  });
});

// 工具函数
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function loadData(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

// 研究
const researchForm = document.getElementById('research-form');
const researchList = document.getElementById('research-list');
let researchData = loadData('research');
function renderResearch() {
  researchList.innerHTML = '';
  researchData.forEach((item, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<span><b>${item.title}</b>：${item.desc}</span>
      <button class="delete-btn" title="删除" onclick="deleteResearch(${idx})">🗑</button>`;
    researchList.appendChild(li);
  });
}
window.deleteResearch = function(idx) {
  researchData.splice(idx, 1);
  saveData('research', researchData);
  renderResearch();
};
researchForm.onsubmit = e => {
  e.preventDefault();
  const title = document.getElementById('research-title').value.trim();
  const desc = document.getElementById('research-desc').value.trim();
  if (title && desc) {
    researchData.unshift({title, desc});
    saveData('research', researchData);
    renderResearch();
    researchForm.reset();
  }
};
renderResearch();

// 发表
const pubForm = document.getElementById('pub-form');
const pubList = document.getElementById('pub-list');
let pubData = loadData('publications');
function renderPub() {
  pubList.innerHTML = '';
  pubData.forEach((item, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<span><b>${item.title}</b> (${item.conf}) <a href="${item.link}" target="_blank">论文链接</a></span>
      <button class="delete-btn" title="删除" onclick="deletePub(${idx})">🗑</button>`;
    pubList.appendChild(li);
  });
}
window.deletePub = function(idx) {
  pubData.splice(idx, 1);
  saveData('publications', pubData);
  renderPub();
};
pubForm.onsubmit = e => {
  e.preventDefault();
  const title = document.getElementById('pub-title').value.trim();
  const conf = document.getElementById('pub-conf').value.trim();
  const link = document.getElementById('pub-link').value.trim();
  if (title && conf && link) {
    pubData.unshift({title, conf, link});
    saveData('publications', pubData);
    renderPub();
    pubForm.reset();
  }
};
renderPub();

// 日常
const dailyForm = document.getElementById('daily-form');
const dailyList = document.getElementById('daily-list');
let dailyData = loadData('daily');
function renderDaily() {
  dailyList.innerHTML = '';
  dailyData.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'daily-item';
    div.innerHTML = `<div>${item.text}</div>
      ${item.img ? `<img src="${item.img}" alt="日常图片">` : ''}
      <button class="delete-btn" title="删除" onclick="deleteDaily(${idx})">🗑</button>
      <div style="color:#888;font-size:0.95rem;margin-top:4px;">${item.time}</div>`;
    dailyList.appendChild(div);
  });
}
window.deleteDaily = function(idx) {
  dailyData.splice(idx, 1);
  saveData('daily', dailyData);
  renderDaily();
};
dailyForm.onsubmit = async e => {
  e.preventDefault();
  const text = document.getElementById('daily-text').value.trim();
  const imgInput = document.getElementById('daily-img');
  let img = '';
  if (imgInput.files[0]) {
    img = await toBase64(imgInput.files[0]);
  }
  if (text || img) {
    dailyData.unshift({
      text,
      img,
      time: new Date().toLocaleString()
    });
    saveData('daily', dailyData);
    renderDaily();
    dailyForm.reset();
  }
};
renderDaily();

// 技术博客
const blogForm = document.getElementById('blog-form');
const blogList = document.getElementById('blog-list');
let blogData = loadData('blog');
function renderBlog() {
  blogList.innerHTML = '';
  blogData.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'blog-item';
    div.innerHTML = `
      <div class="blog-title">${item.title}</div>
      <span class="blog-date">${item.time}</span>
      <div class="blog-content">${marked(item.content)}</div>
      ${item.img ? `<img src="${item.img}" alt="博客图片">` : ''}
      <button class="delete-btn" title="删除" onclick="deleteBlog(${idx})">🗑</button>
    `;
    blogList.appendChild(div);
  });
}
window.deleteBlog = function(idx) {
  blogData.splice(idx, 1);
  saveData('blog', blogData);
  renderBlog();
};
blogForm.onsubmit = async e => {
  e.preventDefault();
  const title = document.getElementById('blog-title').value.trim();
  const content = document.getElementById('blog-content').value.trim();
  const imgInput = document.getElementById('blog-img');
  let img = '';
  if (imgInput.files[0]) {
    img = await toBase64(imgInput.files[0]);
  }
  if (title && content) {
    blogData.unshift({
      title,
      content,
      img,
      time: new Date().toLocaleString()
    });
    saveData('blog', blogData);
    renderBlog();
    blogForm.reset();
  }
};
renderBlog();

// 图片转Base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Markdown渲染（引入marked.js）
(function loadMarked() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
  script.onload = () => renderBlog();
  document.body.appendChild(script);
})();
