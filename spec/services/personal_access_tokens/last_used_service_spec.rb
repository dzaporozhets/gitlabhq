# frozen_string_literal: true

require 'spec_helper'

RSpec.describe PersonalAccessTokens::LastUsedService, feature_category: :system_access do
  describe '#execute' do
    subject { described_class.new(personal_access_token).execute }

    context 'when the personal access token was used 10 minutes ago', :freeze_time do
      let(:personal_access_token) { create(:personal_access_token, last_used_at: 10.minutes.ago) }

      it 'updates the last_used_at timestamp' do
        expect { subject }.to change { personal_access_token.last_used_at }
      end

      it 'does not run on read-only GitLab instances' do
        allow(::Gitlab::Database).to receive(:read_only?).and_return(true)

        expect { subject }.not_to change { personal_access_token.last_used_at }
      end

      context 'when database load balancing is configured' do
        let!(:service) { described_class.new(personal_access_token) }

        it 'does not stick to primary' do
          ::Gitlab::Database::LoadBalancing::Session.clear_session

          expect(::Gitlab::Database::LoadBalancing::Session.current).not_to be_performed_write
          expect { service.execute }.to change { personal_access_token.last_used_at }
          expect(::Gitlab::Database::LoadBalancing::Session.current).to be_performed_write
          expect(::Gitlab::Database::LoadBalancing::Session.current).not_to be_using_primary
        end

        context 'with disable_sticky_writes_for_pat_last_used disabled' do
          before do
            stub_feature_flags(disable_sticky_writes_for_pat_last_used: false)
          end

          it 'does stick to primary' do
            ::Gitlab::Database::LoadBalancing::Session.clear_session

            expect(::Gitlab::Database::LoadBalancing::Session.current).not_to be_performed_write
            expect { service.execute }.to change { personal_access_token.last_used_at }
            expect(::Gitlab::Database::LoadBalancing::Session.current).to be_performed_write
            expect(::Gitlab::Database::LoadBalancing::Session.current).to be_using_primary
          end
        end
      end
    end

    context 'when the personal access token was used less than 10 minutes ago', :freeze_time do
      let(:personal_access_token) { create(:personal_access_token, last_used_at: (10.minutes - 1.second).ago) }

      it 'does not update the last_used_at timestamp' do
        expect { subject }.not_to change { personal_access_token.last_used_at }
      end
    end

    context 'when the last_used_at timestamp is nil' do
      let_it_be(:personal_access_token) { create(:personal_access_token, last_used_at: nil) }

      it 'updates the last_used_at timestamp' do
        expect { subject }.to change { personal_access_token.last_used_at }
      end
    end

    context 'when not a personal access token' do
      let_it_be(:personal_access_token) { create(:oauth_access_token) }

      it 'does not execute' do
        expect(subject).to be_nil
      end
    end
  end
end
