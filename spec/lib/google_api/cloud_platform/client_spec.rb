require 'spec_helper'

describe GoogleApi::CloudPlatform::Client do
  let(:token) { 'token' }
  let(:client) { described_class.new(token, nil) }

  describe '.session_key_for_redirect_uri' do
    let(:state) { 'random_string' }

    subject { described_class.session_key_for_redirect_uri(state) }

    it 'creates a new session key' do
      is_expected.to eq('cloud_platform_second_redirect_uri_random_string')
    end
  end

  describe '.new_session_key_for_redirect_uri' do
    it 'generates a new session key' do
      expect { |b| described_class.new_session_key_for_redirect_uri(&b) }
        .to yield_with_args(String)
    end
  end

  describe '#validate_token' do
    subject { client.validate_token(expires_at) }

    let(:expires_at) { 1.hour.since.utc.strftime('%s') }

    context 'when token is nil' do
      let(:token) { nil }

      it { is_expected.to be_falsy }
    end

    context 'when expires_at is nil' do
      let(:expires_at) { nil }

      it { is_expected.to be_falsy }
    end

    context 'when expires in 1 hour' do
      it { is_expected.to be_truthy }
    end

    context 'when expires in 10 minutes' do
      let(:expires_at) { 5.minutes.since.utc.strftime('%s') }

      it { is_expected.to be_falsy }
    end
  end

  describe '#projects_zones_clusters_get' do
    subject { client.projects_zones_clusters_get(spy, spy, spy) }
    let(:gke_cluster) { double }

    before do
      allow_any_instance_of(Google::Apis::ContainerV1::ContainerService)
        .to receive(:get_zone_cluster).and_return(gke_cluster)
    end

    it { is_expected.to eq(gke_cluster) }
  end

  describe '#projects_zones_clusters_create' do
    subject do
      client.projects_zones_clusters_create(
        spy, spy, cluster_name, cluster_size, machine_type: machine_type)
    end

    let(:cluster_name) { 'test-cluster' }
    let(:cluster_size) { 1 }
    let(:machine_type) { 'n1-standard-4' }
    let(:operation) { double }

    before do
      allow_any_instance_of(Google::Apis::ContainerV1::ContainerService)
        .to receive(:create_cluster).and_return(operation)
    end

    it { is_expected.to eq(operation) }

    it 'sets corresponded parameters' do
      expect_any_instance_of(Google::Apis::ContainerV1::CreateClusterRequest)
        .to receive(:initialize).with(
          {
            "cluster": {
              "name": cluster_name,
              "initial_node_count": cluster_size,
              "node_config": {
                "machine_type": machine_type
              }
            }
          } )

      subject
    end
  end

  describe '#projects_zones_operations' do
    subject { client.projects_zones_operations(spy, spy, spy) }
    let(:operation) { double }

    before do
      allow_any_instance_of(Google::Apis::ContainerV1::ContainerService)
        .to receive(:get_zone_operation).and_return(operation)
    end

    it { is_expected.to eq(operation) }
  end

  describe '#parse_operation_id' do
    subject { client.parse_operation_id(self_link) }

    context 'when expected url' do
      let(:self_link) do
        'projects/gcp-project-12345/zones/us-central1-a/operations/ope-123'
      end

      it { is_expected.to eq('ope-123') }
    end

    context 'when unexpected url' do
      let(:self_link) { '???' }

      it { is_expected.to be_nil }
    end
  end
end
