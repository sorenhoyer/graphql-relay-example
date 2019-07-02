// dummy data
export const languages = [{
  id: '1',
  name: 'Danish',
}, {
  id: '2',
  name: 'English'
}];

export const users = [{
  id: '1',
  firstName: 'Foo',
  languageId: '1',
}, {
  id: '2',
  firstName: 'Bar',
  languageId: '2',
}];

export const translations = [{
  id: '1',
  applicationId: '1',
  languageId: '1',
  key: 'SOME_KEY',
  value: 'Some Translated value',
},
{
  id: '2',
  applicationId: '2',
  languageId: '1',
  key: 'SOME_OTHER_KEY',
  value: 'Some other Translated value',
}]