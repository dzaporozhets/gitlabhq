import Vue, { nextTick } from 'vue';
import VueApollo from 'vue-apollo';
import { GlCollapsibleListbox } from '@gitlab/ui';
import { mountExtended } from 'helpers/vue_test_utils_helper';
import createMockApollo from 'helpers/mock_apollo_helper';
import waitForPromises from 'helpers/wait_for_promises';
import WorkItemProjectsListbox from '~/work_items/components/work_item_links/work_item_projects_listbox.vue';
import namespaceProjectsForLinksWidgetQuery from '~/work_items/graphql/namespace_projects_for_links_widget.query.graphql';
import { SEARCH_DEBOUNCE } from '~/work_items/constants';
import { namespaceProjectsList, mockFrequentlyUsedProjects } from '../../mock_data';

Vue.use(VueApollo);

const namespaceProjectsData = namespaceProjectsList.data.namespace.projects.nodes;

describe('WorkItemProjectsListbox', () => {
  /**
   * @type {import('helpers/vue_test_utils_helper').ExtendedWrapper}
   */
  let wrapper;

  const getLocalstorageKey = () => {
    return 'root/frequent-projects';
  };

  const setLocalstorageFrequentItems = (json = mockFrequentlyUsedProjects) => {
    localStorage.setItem(getLocalstorageKey(), JSON.stringify(json));
  };

  const removeLocalstorageFrequentItems = () => {
    localStorage.removeItem(getLocalstorageKey());
  };

  const namespaceProjectsFormLinksWidgetResolver = jest
    .fn()
    .mockResolvedValue(namespaceProjectsList);

  const findDropdown = () => wrapper.findComponent(GlCollapsibleListbox);
  const findDropdownItemFor = (fullPath) => wrapper.findByTestId(`listbox-item-${fullPath}`);
  const findRecentDropdownItems = () => findDropdown().find('ul').findAll('[role=option]');
  const findRecentDropdownItemAt = (index) => findRecentDropdownItems().at(index);

  const createComponent = async (isGroup = true, fullPath = 'group-a') => {
    wrapper = mountExtended(WorkItemProjectsListbox, {
      apolloProvider: createMockApollo([
        [namespaceProjectsForLinksWidgetQuery, namespaceProjectsFormLinksWidgetResolver],
      ]),
      propsData: {
        fullPath,
        isGroup,
      },
    });

    jest.advanceTimersByTime(SEARCH_DEBOUNCE);
    await waitForPromises();
  };

  describe('group level work items', () => {
    beforeEach(async () => {
      await createComponent();
      gon.current_username = 'root';
    });

    it('renders projects in projects dropdown', () => {
      removeLocalstorageFrequentItems();

      expect(findDropdown().text()).not.toContain('Recently used');

      const dropdownItem = findDropdownItemFor(namespaceProjectsData[0].fullPath);

      expect(dropdownItem.text()).toContain(namespaceProjectsData[0].name);
      expect(dropdownItem.text()).toContain(namespaceProjectsData[0].namespace.name);
    });

    it('supports selecting a project', async () => {
      removeLocalstorageFrequentItems();

      findDropdown().vm.$emit('shown');

      await nextTick();

      await findDropdownItemFor(namespaceProjectsData[0].fullPath).trigger('click');

      await nextTick();

      const emitted = wrapper.emitted('selectProject');

      expect(emitted[1][0]).toEqual(namespaceProjectsData[0]);
    });

    it('renders recent projects if present', async () => {
      setLocalstorageFrequentItems();

      findDropdown().vm.$emit('shown');

      await nextTick();

      expect(findDropdown().text()).toContain('Recently used');

      const content = findRecentDropdownItems();

      expect(content.exists()).toBe(true);
      expect(content).toHaveLength(mockFrequentlyUsedProjects.length);
    });

    it('supports selecting a recent project', async () => {
      setLocalstorageFrequentItems();

      findDropdown().vm.$emit('shown');

      await nextTick();

      await findRecentDropdownItemAt(0).trigger('click');

      await nextTick();

      const emitted = wrapper.emitted('selectProject');

      expect(emitted[1][0]).toEqual(namespaceProjectsData[1]);
    });

    it('supports filtering recent projects via search input', async () => {
      setLocalstorageFrequentItems();

      findDropdown().vm.$emit('shown');

      await nextTick();

      let content = findRecentDropdownItems();

      expect(content).toHaveLength(mockFrequentlyUsedProjects.length);

      findDropdown().vm.$emit('search', 'project a');

      await nextTick();

      content = findRecentDropdownItems();

      expect(content).toHaveLength(1);
      expect(content.at(0).text()).toContain(namespaceProjectsData[0].name);
    });
  });

  describe('project level work items', () => {
    beforeEach(async () => {
      await createComponent(false, 'group-a/example-project-a');
      gon.current_username = 'root';
    });

    it('renders projects in projects dropdown', () => {
      removeLocalstorageFrequentItems();

      expect(findDropdown().text()).not.toContain('Recently used');

      const dropdownItem = findDropdownItemFor(namespaceProjectsData[0].fullPath);

      expect(dropdownItem.text()).toContain(namespaceProjectsData[0].name);
      expect(dropdownItem.text()).toContain(namespaceProjectsData[0].namespace.name);
    });

    it('auto-selects the current project', async () => {
      await nextTick();

      const emitted = wrapper.emitted('selectProject');

      expect(emitted[0][0]).toEqual(namespaceProjectsData[0]);
    });

    it('supports selecting a project', async () => {
      removeLocalstorageFrequentItems();

      findDropdown().vm.$emit('shown');

      await nextTick();

      await findDropdownItemFor(namespaceProjectsData[1].fullPath).trigger('click');

      await nextTick();

      const emitted = wrapper.emitted('selectProject');

      expect(emitted[1][0]).toEqual(namespaceProjectsData[1]);
    });

    it('renders recent projects if present', async () => {
      setLocalstorageFrequentItems();

      findDropdown().vm.$emit('shown');

      await nextTick();

      expect(findDropdown().text()).toContain('Recently used');

      const content = findRecentDropdownItems();

      expect(content.exists()).toBe(true);
      expect(content).toHaveLength(mockFrequentlyUsedProjects.length);
    });

    it('supports selecting a recent project', async () => {
      setLocalstorageFrequentItems();

      findDropdown().vm.$emit('shown');

      await nextTick();

      await findRecentDropdownItemAt(0).trigger('click');

      await nextTick();

      const emitted = wrapper.emitted('selectProject');

      expect(emitted[1][0]).toEqual(namespaceProjectsData[1]);
    });

    it('supports filtering recent projects via search input', async () => {
      setLocalstorageFrequentItems();

      findDropdown().vm.$emit('shown');

      await nextTick();

      let content = findRecentDropdownItems();

      expect(content).toHaveLength(mockFrequentlyUsedProjects.length);

      findDropdown().vm.$emit('search', 'project a');

      await nextTick();

      content = findRecentDropdownItems();

      expect(content).toHaveLength(1);
      expect(content.at(0).text()).toContain(namespaceProjectsData[0].name);
    });
  });
});
