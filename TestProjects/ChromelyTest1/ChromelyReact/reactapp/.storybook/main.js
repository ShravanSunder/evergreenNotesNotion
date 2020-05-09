module.exports = {
  stories: ['../src/**/*.stories.(js|mdx|jsx|tsx|ts)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-viewport/register',
    '@storybook/addon-storysource',
    '@storybook/addon-docs'
  ],
};
