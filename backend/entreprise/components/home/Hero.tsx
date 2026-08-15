import Link from 'next/link';
import Icon from '@/components/ui/Icon';

export default function Hero() {
  return <section id="home" className="hero"><div className="container hero-grid">
    <div>
      <div className="eyebrow">La nouvelle façon de recruter</div>
      <h1>Les talents qui feront grandir <span className="gradient-text">votre entreprise.</span></h1>
      <p className="hero-copy">JOBSINC donne à vos équipes les bons outils pour trouver, évaluer et engager les profils qui font vraiment la différence.</p>
      <div className="hero-actions"><Link href="/register" className="button button-primary">Créer mon compte entreprise <Icon name="arrow" size={17} /></Link><Link href="#how" className="button button-outline">Découvrir JOBSINC</Link></div>
      <p className="microcopy">Inscription gratuite <span>•</span> Gestion simple <span>•</span> Recrutement intelligent</p>
    </div>
    <div className="hero-visual" aria-label="Aperçu du tableau de bord de recrutement">
      <div className="dashboard-card"><div className="dash-top"><span className="dash-title">Vue d’ensemble</span><span className="dash-status">En activité</span></div><div className="dash-body"><div><div className="dash-label">Talents trouvés</div><div className="dash-number">124</div><div className="dash-trend">+18% ce mois-ci</div></div><div><div className="dash-label">Activité</div><div className="dash-bars"><i/><i/><i/><i/><i/></div></div><div className="candidate-list"><div className="dash-label">Profils récemment ajoutés</div><div className="candidate"><div className="avatar">AN</div><div><strong>Amadou Ndiaye</strong><small>Développeur Full Stack</small></div><span className="match">94%</span></div><div className="candidate"><div className="avatar">FS</div><div><strong>Fatou Sarr</strong><small>Responsable produit</small></div><span className="match">92%</span></div></div></div></div>
      <div className="float-card one"><span>Matching</span><strong>92%</strong><span>Excellent profil</span></div><div className="float-card two"><span>Candidature reçue</span><strong><Icon name="check" size={16} /> aujourd’hui</strong></div>
    </div>
  </div></section>;
}
