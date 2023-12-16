// eslint-disable-next-line @typescript-eslint/no-unused-vars
const changeLanguage = (langKey: string) => {
  $.ajax({
    url: '/lang',
    type: 'POST',
    data: { langKey: langKey },
    success: (res) => {
      document.documentElement.lang = langKey;
      document.documentElement.dir = res?.dir ?? 'ltr';
      document.documentElement.style.fontSize = `${
        (res?.fontScale ?? 1) * 100
      }%`;
      localStorage.setItem('lang', JSON.stringify(res));

      location.reload();
    },
  });
};

const language = JSON.parse(localStorage.getItem('lang') ?? '{}');
document.documentElement.lang = language?.key;
document.documentElement.dir = language?.dir ?? 'ltr';
document.documentElement.style.fontSize = `${
  (language?.fontScale ?? 1) * 100
}%`;

const LANGUAGE_TABLE = [
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'ar', name: 'مغربي', flag: '🇲🇦' },
  { id: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
];

const lang = LANGUAGE_TABLE.find((el) => el.id === language.key);
$('.dropdown.lang .dropdown-toggle').html(`${lang?.flag} ${lang?.name}`);