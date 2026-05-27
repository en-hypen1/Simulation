# Simulim Phishing — Teza e Diplomës
**Arnilda Bibaj · Universiteti i Shkodrës 2026**

## Hapat e instalimit

### 1. Supabase (databaza)
1. Shko te [supabase.com](https://supabase.com) → krijo llogari falas
2. Krijo projekt të ri (p.sh. "phishing-sim")
3. Shko te **SQL Editor** dhe ekzekuto:

```sql
create table clicks (
  id bigint generated always as identity primary key,
  source text,
  device text,
  city text,
  page_load boolean default false,
  clicked_button boolean default false,
  created_at timestamptz default now()
);
```

4. Shko te **Settings → API** dhe kopjo:
   - `Project URL` → kjo është `SUPABASE_URL`
   - `service_role` key → kjo është `SUPABASE_SERVICE_KEY`

---

### 2. GitHub
1. Krijo repository të ri (p.sh. "phishing-sim")
2. Ngarko të gjithë skedarët e këtij projekti

---

### 3. Vercel
1. Shko te [vercel.com](https://vercel.com) → lidhu me GitHub
2. Importo repository-n
3. Shko te **Settings → Environment Variables** dhe shto:
   - `SUPABASE_URL` = URL-ja nga Supabase
   - `SUPABASE_SERVICE_KEY` = çelësi service_role

4. Kliko **Deploy**

---

### 4. Linqet për dërgim
Pasi të deplojohet, URL-ja jote do jetë diçka si `https://phishing-sim-arnilda.vercel.app`

Dërgo linqe të ndryshme sipas platformës:
- **WhatsApp:** `https://faqja-jote.vercel.app/?src=wa`
- **Gmail:** `https://faqja-jote.vercel.app/?src=gmail`
- **Instagram:** `https://faqja-jote.vercel.app/?src=ig`
- **Facebook:** `https://faqja-jote.vercel.app/?src=fb`

---

### 5. Dashboard
Hap: `https://faqja-jote.vercel.app/dashboard.html`

Fjalëkalimi: **arnilda2026** *(ndrysho në dashboard.html nëse dëshiron)*

---

## Çfarë regjistron sistemi
- Ora dhe data e klikimit
- Pajisja (telefon / PC / tablet)
- Qyteti (nga IP)
- Burimi (WhatsApp / Gmail / Instagram / Facebook)
- Nëse hapi vetëm faqen apo klikoi edhe butonin
