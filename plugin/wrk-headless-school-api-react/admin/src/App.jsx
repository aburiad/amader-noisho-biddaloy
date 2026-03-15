import React, { useEffect, useMemo, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import InputField, { inferMultiline } from './components/InputField';
import RepeaterField from './components/RepeaterField';
import { PAGE_TITLES, prettifyLabel } from './data/fieldLabels';

apiFetch.use(apiFetch.createNonceMiddleware(window.WRK_HSA_ADMIN.restNonce));
apiFetch.use(apiFetch.createRootURLMiddleware(window.WRK_HSA_ADMIN.restRoot.replace(/school\/v1\/?$/, '')));

const tabs = ['overview', 'global', 'home', 'about', 'academic', 'admission', 'contact', 'notices', 'gallery'];

const arraySchemas = {
  global: {
    office_hours: ['label', 'value'],
    nav_links: ['path', 'label'],
    quick_links: ['path', 'label'],
  },
  pages: {
    home: { features: ['title', 'description', 'icon'], mission_items: ['title', 'description'] },
    about: { intro_paragraphs: ['text'], who_can_join_items: ['text'], values: ['title', 'description'] },
    academic: { class_schedule: ['label', 'value'], classes: ['title', 'description'], highlights: ['text'] },
    admission: { requirements: ['text'], steps: ['title', 'description'], fees: ['label', 'value'] },
    contact: { faqs: ['question', 'answer'] },
    notices: { categories: ['label', 'value'] },
  },
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function StatCard({ title, value, subtitle }) {
  return React.createElement('div', { className: 'wrk-stat' },
    React.createElement('div', { className: 'wrk-stat__value' }, value),
    React.createElement('div', { className: 'wrk-stat__title' }, title),
    React.createElement('div', { className: 'wrk-stat__subtitle' }, subtitle)
  );
}

function Header({ dirty, saving, onSave }) {
  return React.createElement('div', { className: 'wrk-topbar' },
    React.createElement('div', null,
      React.createElement('div', { className: 'wrk-eyebrow' }, 'Headless WordPress CMS'),
      React.createElement('h1', { className: 'wrk-title' }, 'School CMS Dashboard')
    ),
    React.createElement('div', { className: 'wrk-topbar__actions' },
      React.createElement('span', { className: `wrk-badge ${dirty ? 'is-dirty' : 'is-clean'}` }, dirty ? 'Unsaved changes' : 'Everything saved'),
      React.createElement('button', { className: 'wrk-button wrk-button--primary', onClick: onSave, disabled: saving }, saving ? 'Saving...' : 'Save changes')
    )
  );
}

function MediaField({ label, imageUrl, value, onSelect }) {
  const openMedia = () => {
    if (!window.wp?.media) return;
    const frame = window.wp.media({ title: label, multiple: false, library: { type: 'image' } });
    frame.on('select', () => {
      const attachment = frame.state().get('selection').first().toJSON();
      onSelect({ id: attachment.id, url: attachment.url });
    });
    frame.open();
  };

  return React.createElement('div', { className: 'wrk-logo-card' },
    React.createElement('div', { className: 'wrk-logo-card__preview' },
      imageUrl ? React.createElement('img', { src: imageUrl, alt: label }) : React.createElement('div', { className: 'wrk-logo-card__placeholder' }, 'No logo selected')
    ),
    React.createElement('div', { className: 'wrk-logo-card__body' },
      React.createElement('div', { className: 'wrk-field__label' }, label),
      React.createElement('div', { className: 'wrk-muted' }, value ? `Attachment ID: ${value}` : 'Choose a logo from the media library.'),
      React.createElement('div', { className: 'wrk-inline-actions' },
        React.createElement('button', { type: 'button', className: 'wrk-button wrk-button--secondary', onClick: openMedia }, value ? 'Replace logo' : 'Select logo'),
        value ? React.createElement('button', { type: 'button', className: 'wrk-button wrk-button--ghost', onClick: () => onSelect({ id: 0, url: '' }) }, 'Remove') : null
      )
    )
  );
}

export default function App() {
  const [content, setContent] = useState(null);
  const [initialContent, setInitialContent] = useState(null);
  const [meta, setMeta] = useState({ notices_count: 0, gallery_count: 0 });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch({ path: '/school/v1/admin/content' });
      setContent(res.data.content);
      setInitialContent(deepClone(res.data.content));
      setMeta(res.data.meta || {});
    } catch (e) {
      setError(e.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const dirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(initialContent), [content, initialContent]);

  const patchGlobal = (key, value) => {
    setContent((prev) => ({ ...prev, global: { ...prev.global, [key]: value } }));
  };

  const patchPage = (page, key, value) => {
    setContent((prev) => ({ ...prev, pages: { ...prev.pages, [page]: { ...prev.pages[page], [key]: value } } }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const res = await apiFetch({
        path: '/school/v1/admin/content',
        method: 'POST',
        data: { content },
      });
      setContent(res.data);
      setInitialContent(deepClone(res.data));
      setNotice(res.message || 'Saved successfully.');
    } catch (e) {
      setError(e.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return React.createElement('div', { className: 'wrk-loading' }, 'Loading modern CMS dashboard...');
  }

  if (!content) {
    return React.createElement('div', { className: 'wrk-error' }, error || 'Unable to load CMS data.');
  }

  const renderGlobal = () => React.createElement('div', { className: 'wrk-panel-stack' },
    React.createElement('div', { className: 'wrk-card' },
      React.createElement('div', { className: 'wrk-card__head' },
        React.createElement('h2', null, 'Brand & contact'),
        React.createElement('p', null, 'Manage globally shared content used by your React app header, footer, and contact sections.')
      ),
      React.createElement('div', { className: 'wrk-grid wrk-grid--2' },
        React.createElement(InputField, { label: 'Site name', value: content.global.site_name, onChange: (v) => patchGlobal('site_name', v) }),
        React.createElement(InputField, { label: 'Site tagline', value: content.global.site_tagline, onChange: (v) => patchGlobal('site_tagline', v) }),
        React.createElement(InputField, { label: 'Phone', value: content.global.phone, onChange: (v) => patchGlobal('phone', v) }),
        React.createElement(InputField, { label: 'Email', value: content.global.email, onChange: (v) => patchGlobal('email', v) }),
        React.createElement(InputField, { label: 'Facebook URL', value: content.global.facebook_url, onChange: (v) => patchGlobal('facebook_url', v) }),
        React.createElement(InputField, { label: 'YouTube URL', value: content.global.youtube_url, onChange: (v) => patchGlobal('youtube_url', v) }),
        React.createElement(InputField, { label: 'Address', value: content.global.address, onChange: (v) => patchGlobal('address', v), multiline: true }),
        React.createElement(InputField, { label: 'Footer text', value: content.global.footer_text, onChange: (v) => patchGlobal('footer_text', v), multiline: true }),
        React.createElement(InputField, { label: 'Footer copyright', value: content.global.footer_copyright, onChange: (v) => patchGlobal('footer_copyright', v) })
      ),
      React.createElement(MediaField, {
        label: 'Logo image',
        imageUrl: content.global.logo_url,
        value: content.global.logo_id,
        onSelect: ({ id, url }) => setContent((prev) => ({ ...prev, global: { ...prev.global, logo_id: id, logo_url: url } })),
      })
    ),
    React.createElement('div', { className: 'wrk-card' }, React.createElement(RepeaterField, {
      label: 'Office hours',
      items: content.global.office_hours,
      columns: arraySchemas.global.office_hours,
      onChange: (v) => patchGlobal('office_hours', v),
    })),
    React.createElement('div', { className: 'wrk-grid wrk-grid--2' },
      React.createElement('div', { className: 'wrk-card' }, React.createElement(RepeaterField, {
        label: 'Navigation links',
        items: content.global.nav_links,
        columns: arraySchemas.global.nav_links,
        onChange: (v) => patchGlobal('nav_links', v),
      })),
      React.createElement('div', { className: 'wrk-card' }, React.createElement(RepeaterField, {
        label: 'Quick links',
        items: content.global.quick_links,
        columns: arraySchemas.global.quick_links,
        onChange: (v) => patchGlobal('quick_links', v),
      }))
    )
  );

  const renderPage = (slug) => {
    const fields = content.pages[slug] || {};
    const arrayMap = arraySchemas.pages[slug] || {};
    return React.createElement('div', { className: 'wrk-panel-stack' },
      React.createElement('div', { className: 'wrk-card' },
        React.createElement('div', { className: 'wrk-card__head' },
          React.createElement('h2', null, PAGE_TITLES[slug]),
          React.createElement('p', null, 'These fields are exposed directly to your React frontend via the custom REST API.')
        ),
        React.createElement('div', { className: 'wrk-grid wrk-grid--2' },
          Object.entries(fields)
            .filter(([, value]) => !Array.isArray(value))
            .map(([key, value]) => React.createElement(InputField, {
              key,
              label: prettifyLabel(key),
              value,
              multiline: inferMultiline(key, value),
              onChange: (next) => patchPage(slug, key, next),
            }))
        )
      ),
      Object.entries(fields)
        .filter(([, value]) => Array.isArray(value))
        .map(([key, value]) => React.createElement('div', { className: 'wrk-card', key },
          React.createElement(RepeaterField, {
            label: prettifyLabel(key),
            items: value,
            columns: arrayMap[key] || ['text'],
            onChange: (next) => patchPage(slug, key, next),
          })
        ))
    );
  };

  const renderOverview = () => React.createElement('div', { className: 'wrk-panel-stack' },
    React.createElement('div', { className: 'wrk-hero-card' },
      React.createElement('div', null,
        React.createElement('div', { className: 'wrk-eyebrow' }, 'Modern React dashboard'),
        React.createElement('h2', { className: 'wrk-hero-title' }, 'Manage all public content from one clean admin interface.'),
        React.createElement('p', { className: 'wrk-hero-copy' }, 'This dashboard saves structured content into WordPress options and exposes it through your custom REST API. Your React app can render everything dynamically without hardcoded text.')
      ),
      React.createElement('div', { className: 'wrk-hero-actions' },
        React.createElement('a', { className: 'wrk-button wrk-button--secondary', href: `${window.WRK_HSA_ADMIN.siteUrl}wp-json/school/v1/bootstrap`, target: '_blank', rel: 'noreferrer' }, 'Open bootstrap API'),
        React.createElement('button', { className: 'wrk-button wrk-button--primary', onClick: handleSave, disabled: saving }, saving ? 'Saving...' : 'Save content')
      )
    ),
    React.createElement('div', { className: 'wrk-grid wrk-grid--4' },
      React.createElement(StatCard, { title: 'Managed pages', value: Object.keys(content.pages).length, subtitle: 'Homepage to gallery' }),
      React.createElement(StatCard, { title: 'Notice posts', value: meta.notices_count || 0, subtitle: 'Native CPT content' }),
      React.createElement(StatCard, { title: 'Gallery posts', value: meta.gallery_count || 0, subtitle: 'Native CPT content' }),
      React.createElement(StatCard, { title: 'REST namespace', value: 'school/v1', subtitle: 'Ready for React frontend' }),
    ),
    React.createElement('div', { className: 'wrk-grid wrk-grid--2' },
      React.createElement('div', { className: 'wrk-card' },
        React.createElement('div', { className: 'wrk-card__head' },
          React.createElement('h2', null, 'Suggested React flow'),
          React.createElement('p', null, 'Use the bootstrap endpoint once during app startup and hydrate your state manager or React Query cache.')
        ),
        React.createElement('pre', { className: 'wrk-code' }, `GET /wp-json/school/v1/bootstrap\n\n{\n  settings: {...},\n  pages: {...},\n  notices: [...],\n  gallery: [...]\n}`)
      ),
      React.createElement('div', { className: 'wrk-card' },
        React.createElement('div', { className: 'wrk-card__head' },
          React.createElement('h2', null, 'Content ownership'),
          React.createElement('p', null, 'Static structured pages live here. High-volume content stays in native WordPress post types for scalability.')
        ),
        React.createElement('div', { className: 'wrk-list' },
          React.createElement('a', { className: 'wrk-list__item', href: `${window.WRK_HSA_ADMIN.adminUrl}edit.php?post_type=wrk_notice` }, 'Manage notices →'),
          React.createElement('a', { className: 'wrk-list__item', href: `${window.WRK_HSA_ADMIN.adminUrl}edit.php?post_type=wrk_gallery` }, 'Manage gallery →'),
          React.createElement('a', { className: 'wrk-list__item', href: `${window.WRK_HSA_ADMIN.siteUrl}wp-json/school/v1/settings`, target: '_blank', rel: 'noreferrer' }, 'Settings endpoint →')
        )
      )
    )
  );

  return React.createElement('div', { className: 'wrk-app-shell' },
    React.createElement('aside', { className: 'wrk-sidebar' },
      React.createElement('div', { className: 'wrk-brand' },
        React.createElement('div', { className: 'wrk-brand__logo' }, 'WC'),
        React.createElement('div', null,
          React.createElement('div', { className: 'wrk-brand__name' }, 'School CMS'),
          React.createElement('div', { className: 'wrk-brand__sub' }, `v${window.WRK_HSA_ADMIN.pluginVersion}`)
        )
      ),
      React.createElement('nav', { className: 'wrk-nav' },
        tabs.map((tab) => React.createElement('button', {
          key: tab,
          className: `wrk-nav__item ${activeTab === tab ? 'is-active' : ''}`,
          onClick: () => setActiveTab(tab),
        }, PAGE_TITLES[tab]))
      )
    ),
    React.createElement('main', { className: 'wrk-main' },
      React.createElement(Header, { dirty, saving, onSave: handleSave }),
      notice ? React.createElement('div', { className: 'wrk-alert wrk-alert--success' }, notice) : null,
      error ? React.createElement('div', { className: 'wrk-alert wrk-alert--error' }, error) : null,
      activeTab === 'overview' ? renderOverview() : null,
      activeTab === 'global' ? renderGlobal() : null,
      ['home', 'about', 'academic', 'admission', 'contact', 'notices', 'gallery'].includes(activeTab) ? renderPage(activeTab) : null
    )
  );
}
