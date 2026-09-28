# CMS Operations — Dr Santi's Story

## Roles and publishing rule

- **Editor** writes or revises copy, articles, and events in [cms.drsantistory.com](https://cms.drsantistory.com).
- **Reviewer** checks facts, spelling, links, date, image rights, and the live preview before publication.
- **Publisher** clicks **Publish** only after the reviewer approves the content.

Sanity's current project roles are managed in the Sanity project dashboard. This workflow is a team rule: do not use the Publish button for a draft that has not been reviewed.

## Editing a website page

1. Open **Edit Website** and select the page.
2. Change only the item under **Wording halaman**. Do not add or rename the field labels.
3. Open **Preview halaman** to see the current draft wording in the public layout before it is published.
4. Review the Indonesian/English wording, links, names, and dates.
5. Click **Publish**. Public page copy is refreshed within roughly 1–5 minutes.

## Publishing an article

1. Open **Artikel** and create a document.
2. Complete **Judul artikel**, **URL artikel**, **Ringkasan**, **Foto utama**, **Isi artikel**, and **Deskripsi Google**.
3. Confirm the URL once before publishing; do not change it after sharing publicly.
4. Publish. The article appears on `/articles` and at `/articles/<url-artikel>`.
5. Check the public URL on desktop and mobile.

## Publishing an event

1. Open **Event** and create a document.
2. Keep **Status** as **Draft** while the event is being prepared.
3. Complete the event date, location, summary, image, details, and optional button.
4. Use **Akan datang** for a future event or **Sudah berlangsung** for documentation.
5. Publish. Non-draft events appear in the event archive and have a public URL at `/events/<url-event>`.

## Backup

Before a large campaign, annual refresh, or structural change, an administrator should export the production dataset from the `cms` directory:

```powershell
npx sanity dataset export production backups/sanity-production-YYYY-MM-DD.tar.gz
```

Keep the exported archive in the approved team drive; do not commit it to Git or email it. Retain at least the latest 12 monthly exports and one export before each major website launch.

## Rollback

For a single document, open the document in Sanity and use its history to restore the previous published revision, then publish again. For a wider issue:

1. Pause new publishing and identify the last known-good export.
2. Restore only after the administrator confirms the scope and target dataset.
3. Recheck the affected public pages, articles, and events.
4. Record the incident, restoration time, and reviewer in the team handover log.

## Escalate rather than publish when

- an event date, venue, or registration URL is uncertain;
- an image does not have confirmed permission or suitable alt text;
- a URL has already been shared or indexed;
- a change affects legal, privacy, or contact details;
- the preview is materially different from the intended layout.
