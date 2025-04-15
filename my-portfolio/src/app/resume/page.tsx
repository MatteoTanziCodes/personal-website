// src/app/resume/page.tsx
import SectionHeader from '@components/SectionHeader';

export default function ResumePage() {
  return (
    <div>
      <SectionHeader title="Resume" />
      <a
        href="/Matteo_Tanzi_Resume_2025.pdf"
        className="text-primary underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download Resume (PDF)
      </a>

      <div className="mt-8 space-y-6">
        <div className="border-l-4 border-primary pl-4">
          <h3 className="text-xl font-bold">Backend Developer @ BMO</h3>
          <p className="text-sm text-muted">Jan 2024 – Present</p>
          <ul className="list-disc ml-6 mt-2 space-y-1 text-base">
            <li>Built MEAN-stack monitoring dashboard integrated with ELK and LDAP</li>
            <li>Replaced on-prem vendor logic with AWS Lambda functions for payment processing</li>
            <li>Reduced costs by eliminating license renewals</li>
          </ul>
        </div>

        <div className="border-l-4 border-primary pl-4">
          <h3 className="text-xl font-bold">DevOps Engineer @ BMO</h3>
          <p className="text-sm text-muted">Jul 2022 – Dec 2023</p>
          <ul className="list-disc ml-6 mt-2 space-y-1 text-base">
            <li>Built a CGI app to visualize Kafka and Ansible metrics</li>
            <li>Enabled QA deployment automation with Ansible + Jython</li>
            <li>Developed REST APIs for payment simulation in QA</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
