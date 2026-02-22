// components/categories-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CampusLostAndFoundProps {
  /** When true, hide the component's header (for use inside categories page) */
  embedded?: boolean;
}

export default function CampusLostAndFound({ embedded }: CampusLostAndFoundProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    productType: '',
    size: '',
    color: '',
    timeLost: '',
    status: 'lost'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formData.name.trim()) params.set('name', formData.name.trim());
    if (formData.productType) params.set('category', formData.productType);
    if (formData.status) params.set('status', formData.status);
    router.push(`/post?${params.toString()}`);
  };

  return (
    <section>
    {!embedded && (
    <section>
      <div>
        <header>
          <nav style={styles.navbar}>
            <div>
              <h1 style={styles.titles}>
                Campus Lost and Found
              </h1>
            </div>
            <div>
              <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>
                Features  
              </a>
            </div>

          </nav>  
        </header>
      </div>
    </section>
    )}
    <section>
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Item Name - Search by similar name */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Item Name (search for similar)</label>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. phone, wallet, keys"
              style={styles.input}
            />
          </div>
        </div>

        {/* Type of Product / Category */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Category</label>
          <div style={styles.inputWrapper}>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Any category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Documents">Documents</option>
              <option value="Accessories">Accessories</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        {/* Size */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Size</label>
          <div style={styles.inputWrapper}>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Size of the product</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="xl">Extra Large</option>
              <option value="na">Not Applicable</option>
            </select>
          </div>
        </div>

        {/* Color */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Color</label>
          <div style={styles.inputWrapper}>
            <select
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Color of the product</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Time Lost (Optional) */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>How long have you lost it? (Optional)</label>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              name="timeLost"
              value={formData.timeLost}
              onChange={handleChange}
              placeholder=""
              style={styles.input}
            />
          </div>
        </div>

        {/* Status (Lost or Found) */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Status (Lost or Found)</label>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="status"
                value="lost"
                checked={formData.status === 'lost'}
                onChange={handleChange}
                style={styles.radioInput}
              />
              <span style={styles.radioText}>Lost</span>
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="status"
                value="found"
                checked={formData.status === 'found'}
                onChange={handleChange}
                style={styles.radioInput}
              />
              <span style={styles.radioText}>Found</span>
            </label>
          </div>
        </div>

        {/* Search Button */}
        <button type="submit" style={styles.button}>
          Search
        </button>
      </form>
    
    </div>
    </section>
    </section>
  );
}

const styles = {
  navbar:{
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '20px 0',
    backgroundColor: '#3DADFF',
  },
  titles: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',

  },
  container: {
    margin: '40px auto',
    width: '400px',
    padding: '40px 30px',
    backgroundColor: '#3DADFF',
    borderRadius: '15px',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '35px',
    textAlign: 'center' as const,
  },
  form: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '28px',
  },
  inputGroup: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '15px',
    fontWeight: '500',
    color: 'white'
  },
  inputWrapper: {
    position: 'relative' as const,
  },
  select: {
    width: '100%',
    margin: '0px',
    padding: '10px 10px',
    fontSize: '15px',
    color: 'black',
    backgroundColor: 'white',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none' as const,
  },
  input: {
    width: '100%',
    padding: '10px 10px',
    fontSize: '15px',
    color: 'black',
    backgroundColor: 'white',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
  },
  radioGroup: {
    display: 'flex' as const,
    gap: '24px',
    margin: '0px',
  },
  radioLabel: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '10px',
    cursor: 'pointer',
  },
  radioInput: {
    width: '18px',
    height: '18px',
    margin: '0',
    cursor: 'pointer',
    accentColor: '#3DADFF',
  },
  radioText: {
    fontSize: '15px',
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    color: 'black',
    border: '1.5px solid #3DADFF',
    padding: '10px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    margin: '5px',
    transition: 'background-color 0.2s ease',
  },
};