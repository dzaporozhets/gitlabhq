import { GlLoadingIcon } from '@gitlab/ui';
import { shallowMountExtended } from 'helpers/vue_test_utils_helper';
import waitForPromises from 'helpers/wait_for_promises';
import { createAlert } from '~/alert';
import { uploadModel } from '~/ml/model_registry/services/upload_model';
import ImportArtifactZone from '~/ml/model_registry/components/import_artifact_zone.vue';
import UploadDropzone from '~/vue_shared/components/upload_dropzone/upload_dropzone.vue';

jest.mock('~/alert');
jest.mock('~/ml/model_registry/services/upload_model', () => ({
  uploadModel: jest.fn(() => Promise.resolve()),
}));

describe('ImportArtifactZone', () => {
  let wrapper;

  const file = { name: 'file.txt', size: 1024 };
  const initialProps = {
    path: 'some/path',
  };
  const formattedFileSizeDiv = () => wrapper.findByTestId('formatted-file-size');
  const fileNameDiv = () => wrapper.findByTestId('file-name');
  const zone = () => wrapper.findComponent(UploadDropzone);
  const loadingIcon = () => wrapper.findComponent(GlLoadingIcon);
  const emulateFileDrop = () => zone().vm.$emit('change', file);

  describe('successful upload', () => {
    beforeEach(() => {
      wrapper = shallowMountExtended(ImportArtifactZone, {
        propsData: {
          ...initialProps,
        },
      });
    });

    it('displays the formatted file size', async () => {
      await emulateFileDrop();
      expect(formattedFileSizeDiv().text()).toContain('1.00 KiB');
    });

    it('displays the formatted file name', async () => {
      await emulateFileDrop();
      expect(fileNameDiv().text()).toContain('file.txt');
    });

    it('displays the loading icon', async () => {
      await emulateFileDrop();

      expect(loadingIcon().exists()).toBe(true);
    });

    it('resets the file and loading state', async () => {
      await emulateFileDrop();

      await waitForPromises();
      expect(loadingIcon().exists()).toBe(false);
      expect(formattedFileSizeDiv().exists()).toBe(false);
      expect(fileNameDiv().exists()).toBe(false);
    });

    it('submits the request', async () => {
      await emulateFileDrop();
      await waitForPromises();

      expect(uploadModel).toHaveBeenCalledWith({
        file: {
          name: 'file.txt',
          size: 1024,
        },
        importPath: 'some/path',
      });
    });

    it('emits a change event on success', async () => {
      await emulateFileDrop();
      await waitForPromises();

      expect(wrapper.emitted('change')).toStrictEqual([[]]);
    });

    describe('failed uploads', () => {
      beforeEach(() => {
        wrapper = shallowMountExtended(ImportArtifactZone, {
          propsData: {
            ...initialProps,
          },
        });
      });

      it('displays an error on failure', async () => {
        uploadModel.mockRejectedValue('Internal server error.');

        await emulateFileDrop();
        await waitForPromises();

        expect(createAlert).toHaveBeenCalledWith({
          message: 'Error importing artifact. Please try again.',
        });
      });

      it('resets the state on failure', async () => {
        uploadModel.mockRejectedValue('Internal server error.');

        await emulateFileDrop();
        await waitForPromises();
        expect(loadingIcon().exists()).toBe(false);
        expect(formattedFileSizeDiv().exists()).toBe(false);
        expect(fileNameDiv().exists()).toBe(false);
      });
    });

    describe('when submit-on-load is false', () => {
      beforeEach(() => {
        wrapper = shallowMountExtended(ImportArtifactZone, {
          propsData: {
            ...initialProps,
            submitOnSelect: false,
          },
        });
      });

      it('does not submit the request', async () => {
        await emulateFileDrop();
        await waitForPromises();

        expect(uploadModel).not.toHaveBeenCalled();
        expect(loadingIcon().exists()).toBe(false);
      });
    });

    describe('when path is empty', () => {
      beforeEach(() => {
        wrapper = shallowMountExtended(ImportArtifactZone, {
          propsData: {
            ...initialProps,
            path: null,
          },
        });
      });

      it('does not submit the request', async () => {
        await emulateFileDrop();
        await waitForPromises();

        expect(uploadModel).not.toHaveBeenCalled();
        expect(loadingIcon().exists()).toBe(false);
      });
    });
  });
});
