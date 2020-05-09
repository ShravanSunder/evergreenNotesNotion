module.exports = {
  stories: ['../src/**/*.stories.(js|mdx|jsx|tsx|ts)'],
  addons: [
 //   '@storybook/preset-create-react-app',
    '@storybook/addon-knobs/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-links/register',
    '@storybook/addon-docs/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-storysource/register'
  ],
};
