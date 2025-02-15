// assets
import { IconUsers, IconBuildingStore, IconBrandMedium, IconWindmill, IconPackage } from '@tabler/icons-react';

// constant
const icons = {
  IconUsers,
  IconBuildingStore,
  IconBrandMedium,
  IconWindmill,
  IconPackage
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const brandManagerUtilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Users',
      type: 'item',
      url: '/utils/util-typography',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'util-mybrand',
      title: 'My Brand',
      type: 'item',
      url: '/utils/util-mybrand',
      icon: icons.IconBrandMedium,
      breadcrumbs: false
    },
    {
      id: 'util-shadow',
      title: 'Stores',
      type: 'item',
      url: '/utils/util-shadow',
      icon: icons.IconBuildingStore,
      breadcrumbs: false
    },
    {
      id: 'util-myproduct',
      title: 'My Products',
      type: 'item',
      url: '/utils/util-myproduct',
      icon: icons.IconPackage,
      breadcrumbs: false
    },
    {
      id: 'icons',
      title: 'Icons',
      type: 'collapse',
      icon: icons.IconWindmill,
      children: [
        {
          id: 'tabler-icons',
          title: 'Tabler Icons',
          type: 'item',
          url: '/icons/tabler-icons',
          breadcrumbs: false
        },
        {
          id: 'material-icons',
          title: 'Material Icons',
          type: 'item',
          external: true,
          target: '_blank',
          url: 'https://mui.com/material-ui/material-icons/',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default brandManagerUtilities;
