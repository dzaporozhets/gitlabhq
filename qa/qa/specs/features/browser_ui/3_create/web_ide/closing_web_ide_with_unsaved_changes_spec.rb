# frozen_string_literal: true

module QA
  RSpec.describe 'Create', product_group: :ide do
    describe 'Closing Web IDE' do
      let(:file_name) { 'file.txt' }
      let(:project) { create(:project, :with_readme, name: 'webide-close-with-unsaved-changes') }

      before do
        Flow::Login.sign_in
        project.visit!
        Page::Project::Show.perform(&:open_web_ide!)
        Page::Project::WebIDE::VSCode.perform do |ide|
          ide.wait_for_ide_to_load('README.md')
        end
      end

      it 'shows an alert when there are unsaved changes', :blocking,
        testcase: 'https://gitlab.com/gitlab-org/gitlab/-/quality/test_cases/411298' do
        Page::Project::WebIDE::VSCode.perform do |ide|
          ide.create_new_file(file_name)
          Support::Waiter.wait_until { ide.has_pending_changes? }

          ide.close_ide_tab
          expect do
            ide.ide_tab_closed?
          end.to raise_error(Selenium::WebDriver::Error::UnexpectedAlertOpenError, /unexpected alert open/)
        end
      end
    end
  end
end
