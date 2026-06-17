import { useState, useRef } from "react";
import {
  Heart, PawPrint, AlertTriangle, Mail, Menu, X,
  ChevronDown, Star, Upload, Check, ArrowRight, MapPin,
  Syringe, Scissors, Bird, DollarSign,
  LogIn, UserPlus, Home, Stethoscope, Users, Phone,
  Zap, BookOpen, PhoneCall, Clock, Camera, Send, Shield,
  ChevronRight
} from "lucide-react";

import Animais from "./Animais";
import Hospital from "./Hospital";
import Doacoes from "./Doacoes";
import Voluntariado from "./Voluntariado";
import Admin from "./Admin";
import { STATS, PROJECTS } from "./data";
import { api } from "./api";

type Page = "home" | "animais" | "resgates" | "denuncia" | "hospital" | "doacoes" | "voluntariado" | "login" | "cadastro" | "contato" | "blog" | "admin";

const NAV = [
  { label: "Home", page: "home" as Page, icon: Home },
  { label: "Animais", page: "animais" as Page, icon: PawPrint },
  { label: "Resgates", page: "resgates" as Page, icon: AlertTriangle },
  { label: "Denúncias", page: "denuncia" as Page, icon: Shield },
  { label: "Hospital", page: "hospital" as Page, icon: Stethoscope },
  { label: "Doações", page: "doacoes" as Page, icon: Heart },
  { label: "Voluntariado", page: "voluntariado" as Page, icon: Users },
  { label: "Contato", page: "contato" as Page, icon: Phone },
];

const STAT_ICONS = [PawPrint, Heart, Scissors, Syringe, Bird, DollarSign];
const STAT_COLORS = ["text-green-600", "text-red-500", "text-green-700", "text-red-600", "text-green-500", "text-red-500"];

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [rescueUrgency, setRescueUrgency] = useState("media");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [confirmarSenha, setConfirmarSenha] = useState("");
  // Cadastro
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");

// Login usuário
const [loginEmail, setLoginEmail] = useState("");
const [loginSenha, setLoginSenha] = useState("");

// Login admin
const [adminEmail, setAdminEmail] = useState("");
const [adminSenha, setAdminSenha] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  
  const navigate = (p: Page) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setter(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGoogleLogin = () => {
    showToast("Redirecionando para o Google...");
    setTimeout(() => showToast("✓ Login com Google realizado com sucesso!"), 1600);
  };
  

  return (
    <div className="min-h-screen bg-background font-['Nunito',sans-serif] text-foreground">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] bg-green-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0"><Check size={14} /></div>
          <span className="font-semibold text-sm leading-snug">{toast}</span>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <button onClick={() => navigate("home")} className="flex items-center gap-2.5 font-['Playfair_Display',serif] font-bold text-xl text-green-800">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-md shadow-green-200">
              <PawPrint size={20} className="text-white" />
            </div>
            SOS Vida
          </button>
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV.map(n => (
              <button key={n.page} onClick={() => navigate(n.page)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${page === n.page ? "bg-green-100 text-green-800" : "text-gray-600 hover:text-green-700 hover:bg-green-50"}`}>
                {n.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("login")} className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-green-600 text-green-700 font-bold text-sm hover:bg-green-50 transition-all">
              <LogIn size={15} /> Entrar
            </button>
            <button onClick={() => navigate("cadastro")} className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-all shadow-md shadow-green-200">
              <UserPlus size={15} /> Cadastrar
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-border px-4 py-3 grid grid-cols-2 gap-2">
            {NAV.map(n => (
              <button key={n.page} onClick={() => navigate(n.page)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${page === n.page ? "bg-green-100 text-green-800" : "text-gray-600 hover:bg-green-50"}`}>
                <n.icon size={16} /> {n.label}
              </button>
            ))}
            <button onClick={() => navigate("login")} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold border-2 border-green-600 text-green-700"><LogIn size={15} /> Entrar</button>
            <button onClick={() => navigate("cadastro")} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white"><UserPlus size={15} /> Cadastrar</button>
          </div>
        )}
      </nav>

      <div className="pt-16">
        {/* ───── HOME ───── */}
        {page === "home" && (
          <div>
            {/* Hero */}
            <section className="relative min-h-[92vh] flex items-center overflow-hidden">
              <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&h=900&fit=crop&auto=format" alt="Animais resgatados" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-950/92 via-green-900/78 to-transparent" />
              </div>
              <div className="relative max-w-7xl mx-auto px-6 py-20">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
                    <Zap size={14} className="text-yellow-400" /> Mais de 4.800 animais resgatados desde 2012
                  </div>
                  <h1 className="font-['Playfair_Display',serif] font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1] mb-6">
                    Toda vida<br /><span className="text-green-400">merece</span><br />uma chance
                  </h1>
                  <p className="text-white/85 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg">
                    Resgatamos, tratamos e encontramos lares amorosos para animais abandonados e silvestres no Rio de Janeiro.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => navigate("animais")} className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-7 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-2xl shadow-green-900/50">
                      <PawPrint size={22} /> Adote um Animal
                    </button>
                    <button onClick={() => navigate("doacoes")} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-7 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-2xl shadow-red-900/50">
                      <Heart size={22} /> Doe Agora
                    </button>
                    <button onClick={() => navigate("denuncia")} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border-2 border-white/50 text-white font-bold px-6 py-4 rounded-2xl text-lg hover:bg-white/25 transition-all">
                      <AlertTriangle size={20} /> Denunciar
                    </button>
                    <button onClick={() => navigate("resgates")} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border-2 border-white/50 text-white font-bold px-6 py-4 rounded-2xl text-lg hover:bg-white/25 transition-all">
                      <Shield size={20} /> Solicitar Resgate
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce"><ChevronDown size={28} /></div>
            </section>

            {/* Stats */}
            <section className="bg-white py-16 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {STATS.map((s, i) => {
                    const Icon = STAT_ICONS[i];
                    return (
                      <div key={s.label} className="group text-center p-5 rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-100 hover:shadow-lg hover:scale-105 transition-all cursor-default">
                        <Icon size={28} className={`${STAT_COLORS[i]} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                        <div className="font-['Playfair_Display',serif] font-bold text-2xl text-gray-800">{s.value}</div>
                        <div className="text-xs text-muted-foreground font-semibold mt-1 leading-tight">{s.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Sobre */}
            <section className="py-20 px-4 bg-gradient-to-br from-green-950 to-green-900 text-white">
              <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-green-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                    <Heart size={14} /> Sobre a SOS Vida
                  </div>
                  <h2 className="font-['Playfair_Display',serif] font-bold text-4xl sm:text-5xl leading-tight mb-6">
                    Desde 2012 cuidando<br />de quem não tem voz
                  </h2>
                  <p className="text-white/80 text-lg leading-relaxed mb-4">
                    A SOS Vida nasceu do amor incondicional pelos animais. Em mais de uma década, construímos uma rede de resgate, tratamento e adoção que transforma vidas — tanto dos animais quanto das famílias que os acolhem.
                  </p>
                  <p className="text-white/70 leading-relaxed mb-8">
                    Nosso hospital veterinário solidário atende gratuitamente todos os animais resgatados. Temos equipe de 4 veterinários, UTI 24h e plantão de emergência todos os dias.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => navigate("voluntariado")} className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105">
                      <Users size={18} /> Ser Voluntário
                    </button>
                    <button onClick={() => navigate("doacoes")} className="flex items-center gap-2 bg-white/15 border border-white/40 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/25 transition-all">
                      <Heart size={18} /> Apoiar a ONG
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop&auto=format" alt="Resgate" className="rounded-3xl object-cover h-48 w-full" />
                  <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop&auto=format" alt="Cão adotado" className="rounded-3xl object-cover h-48 w-full mt-8" />
                  <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop&auto=format" alt="Gato resgatado" className="rounded-3xl object-cover h-48 w-full -mt-4" />
                  <img src="https://images.unsplash.com/photo-1567304878922-a0b951e2e0e4?w=300&h=300&fit=crop&auto=format" alt="Veterinário" className="rounded-3xl object-cover h-48 w-full mt-4" />
                </div>
              </div>
            </section>

            {/* Projetos */}
            <section className="py-20 px-4 bg-white">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                  <h2 className="font-['Playfair_Display',serif] font-bold text-4xl sm:text-5xl text-gray-900 mb-4">Nossos Projetos</h2>
                  <p className="text-muted-foreground text-lg max-w-xl mx-auto">Iniciativas que transformam vidas e mudam realidades.</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: "Patinhas Seguras", desc: "Resgate de cães e gatos abandonados.", icon: PawPrint, bg: "bg-green-100", text: "text-green-700" },
                    { title: "Vida Silvestre", desc: "Resgate e reabilitação de animais silvestres.", icon: Bird, bg: "bg-emerald-100", text: "text-emerald-700" },
                    { title: "Castração Solidária", desc: "Castração gratuita para famílias carentes.", icon: Scissors, bg: "bg-teal-100", text: "text-teal-700" },
                    { title: "Hospital Solidário", desc: "Atendimento veterinário para resgatados.", icon: Stethoscope, bg: "bg-red-100", text: "text-red-700" },
                  ].map(p => (
                    <div key={p.title} className="group border border-border rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-default">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${p.bg} ${p.text} mb-5 group-hover:scale-110 transition-transform`}>
                        <p.icon size={28} />
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{p.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Doe CTA */}
            <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white">
              <div className="max-w-4xl mx-auto text-center">
                <Heart size={48} className="mx-auto mb-4 opacity-90" />
                <h2 className="font-['Playfair_Display',serif] font-bold text-4xl mb-4">Sua doação salva vidas</h2>
                <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">R$ 50 paga a alimentação de um animal por um mês. Cada real conta.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {["20", "50", "100", "200"].map(v => (
                    <button key={v} onClick={() => navigate("doacoes")} className="bg-white text-red-700 font-black px-8 py-3.5 rounded-2xl hover:scale-105 transition-all shadow-lg text-lg">
                      R${v}
                    </button>
                  ))}
                  <button onClick={() => navigate("doacoes")} className="bg-white/20 border-2 border-white text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/30 transition-all">
                    Outro valor
                  </button>
                </div>
              </div>
            </section>

            {/* Contato rápido */}
            <section className="py-12 px-4 bg-gray-900 text-white">
              <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
                {[
                  { icon: PhoneCall, v: "(21) 99364-2230", d: "Emergências 24h", href: "tel:+5521993642230" },
                  { icon: Mail, v: "sosvidaipm@gmail.com", d: "Atendimento online", href: "mailto:sosvidaipm@gmail.com" },
                  { icon: MapPin, v: "Rio de Janeiro, RJ", d: "Sede da ONG", href: undefined },
                ].map(c => (
                  <div key={c.v} className="flex flex-col items-center gap-2">
                    <c.icon size={28} className="text-green-400" />
                    {c.href ? (
                      <a href={c.href} className="font-bold hover:text-green-400 transition-colors">{c.v}</a>
                    ) : (
                      <span className="font-bold">{c.v}</span>
                    )}
                    <span className="text-gray-400 text-sm">{c.d}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ── Páginas com componentes separados ── */}
        {page === "animais" && <Animais showToast={showToast} />}
        {page === "hospital" && <Hospital showToast={showToast} />}
        {page === "doacoes" && <Doacoes showToast={showToast} />}
        {page === "voluntariado" && <Voluntariado showToast={showToast} />}
        {page === "admin" && <Admin showToast={showToast} />}

     {/* ───── DENUNCIA ───── */}
{page === "denuncia" && (
  <div className="min-h-screen bg-background">
    <div className="bg-gradient-to-br from-red-800 to-red-950 text-white py-16 px-4 text-center">
      <Shield size={48} className="mx-auto mb-4 opacity-80" />
      <h1 className="font-['Playfair_Display',serif] font-bold text-5xl mb-4">
        Denúncia de Maus-Tratos
      </h1>
      <p className="text-red-200 text-xl">
        Seja a voz de quem não pode falar
      </p>
    </div>

    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-border p-8 space-y-5">

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
          <div>
            <p className="font-bold text-sm text-gray-700">
              Denúncia Anônima
            </p>
            <p className="text-xs text-muted-foreground">
              Sua identidade não será revelada
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id="denuncia-anonima"
              type="checkbox"
              className="sr-only peer"
              defaultChecked
            />
            <div className="w-11 h-6 bg-gray-200 peer-checked:bg-green-500 rounded-full transition-all peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5 text-gray-700">
            Endereço do ocorrido *
          </label>

          <input
            id="denuncia-endereco"
            placeholder="Rua, número, bairro, cidade"
            className="w-full border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5 text-gray-700">
            Tipo de maus-tratos *
          </label>

          <select
            id="denuncia-tipo"
            className="w-full border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          >
            <option value="">Selecione</option>
            <option>Abandono</option>
            <option>Maus-tratos físicos</option>
            <option>Privação de alimentação/água</option>
            <option>Confinamento em espaço inadequado</option>
            <option>Briga de animais</option>
            <option>Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5 text-gray-700">
            Descrição detalhada *
          </label>

          <textarea
            id="denuncia-descricao"
            rows={5}
            placeholder="Descreva os maus-tratos com detalhes: frequência, tipo de animal, quantidade, há quanto tempo ocorre..."
            className="w-full border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">
            Evidências (fotos/vídeos)
          </label>

          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-red-400 rounded-xl p-6 text-center cursor-pointer transition-all"
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="preview"
                className="max-h-40 mx-auto rounded-xl object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload size={28} className="text-red-400" />
                <span className="font-semibold text-sm">
                  Enviar evidências
                </span>
                <span className="text-xs">
                  Aceita múltiplos arquivos
                </span>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => handlePhoto(e, setPhotoPreview)}
            />
          </div>
        </div>

        <button
          onClick={async () => {
            try {
              const endereco = (
                document.getElementById(
                  "denuncia-endereco"
                ) as HTMLInputElement
              )?.value;

              const tipo = (
                document.getElementById(
                  "denuncia-tipo"
                ) as HTMLSelectElement
              )?.value;

              const descricao = (
                document.getElementById(
                  "denuncia-descricao"
                ) as HTMLTextAreaElement
              )?.value;

              const anonima = (
                document.getElementById(
                  "denuncia-anonima"
                ) as HTMLInputElement
              )?.checked;

              try {
  const resultado = await api.denuncias.create({
    endereco,
    tipo,
    descricao,
    anonima,
    status: "pendente",
    createdAt: new Date().toISOString(),
  });

  console.log("DENUNCIA SALVA:", resultado);
} catch (erro) {
  console.error("ERRO AO SALVAR:", erro);
}

              showToast(
                "Denúncia registrada! Nossa equipe analisará e tomará as medidas necessárias. 🛡️"
              );

              setPhotoPreview(null);

              (
                document.getElementById(
                  "denuncia-endereco"
                ) as HTMLInputElement
              ).value = "";

              (
                document.getElementById(
                  "denuncia-tipo"
                ) as HTMLSelectElement
              ).value = "";

              (
                document.getElementById(
                  "denuncia-descricao"
                ) as HTMLTextAreaElement
              ).value = "";
            } catch (error) {
              console.error(error);
              showToast("Erro ao enviar denúncia.");
            }
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.01] shadow-xl shadow-red-200 flex items-center justify-center gap-2"
        >
          <Send size={20} />
          Enviar Denúncia
        </button>

      </div>
    </div>
  </div>
)}

        {/* ───── LOGIN ───── */}
        {page === "login" && (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-200"><PawPrint size={32} className="text-white" /></div>
                <h1 className="font-['Playfair_Display',serif] font-bold text-4xl text-gray-800 mb-2">Entrar</h1>
                <p className="text-muted-foreground">Bem-vindo de volta à família SOS Vida</p>
              </div>
              <div className="bg-white rounded-3xl shadow-xl border border-border p-8">
                <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 py-3.5 rounded-2xl font-bold text-gray-700 transition-all mb-6">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  Entrar com Google
                </button>
                <div className="flex items-center gap-3 mb-5"><div className="flex-1 h-px bg-border" /><span className="text-xs text-muted-foreground font-medium">ou com email</span><div className="flex-1 h-px bg-border" /></div>
                <div className="space-y-4">
                  <input type="email" placeholder="Seu email" className="w-full border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                  <input type="password" placeholder="Senha" className="w-full border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                  <div className="flex justify-end"><button className="text-sm text-green-600 hover:text-green-800 font-semibold">Esqueci minha senha</button></div>
                  <button onClick={() => showToast("Login realizado com sucesso! Bem-vindo! 🐾")} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.01] shadow-xl shadow-green-200">
                    Entrar
                  </button>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-5">
                  Não tem conta? <button onClick={() => navigate("cadastro")} className="text-green-600 font-bold hover:text-green-800">Cadastre-se</button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ───── CADASTRO ───── */}
        {page === "cadastro" && (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-200"><UserPlus size={32} className="text-white" /></div>
                <h1 className="font-['Playfair_Display',serif] font-bold text-4xl text-gray-800 mb-2">Criar Conta</h1>
                <p className="text-muted-foreground">Junte-se à família SOS Vida</p>
              </div>
              <div className="bg-white rounded-3xl shadow-xl border border-border p-8">
                <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 py-3.5 rounded-2xl font-bold text-gray-700 transition-all mb-6">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  Cadastrar com Google
                </button>
                <div className="flex items-center gap-3 mb-5"><div className="flex-1 h-px bg-border" /><span className="text-xs text-muted-foreground font-medium">ou preencha os dados</span><div className="flex-1 h-px bg-border" /></div>
                <div className="flex flex-col items-center mb-5">
                  <div onClick={() => profileRef.current?.click()} className="w-24 h-24 rounded-full border-4 border-green-200 hover:border-green-500 overflow-hidden bg-green-50 flex items-center justify-center mb-2 cursor-pointer transition-all">
                    {profilePhoto ? <img src={profilePhoto} alt="perfil" className="w-full h-full object-cover" /> : <Camera size={36} className="text-green-300" />}
                  </div>
                  <button onClick={() => profileRef.current?.click()} className="text-xs text-green-600 font-semibold hover:text-green-800">Adicionar foto de perfil</button>
                  <input ref={profileRef} type="file" accept="image/*" className="hidden" onChange={e => handlePhoto(e, setProfilePhoto)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                 <input placeholder="Nome completo *" value={nome} onChange={(e) => setNome(e.target.value)} className="border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"/>
                  <input type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} className="sm:col-span-2 border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"/>
                  <input type="password" placeholder="Senha *" value={senha} onChange={(e) => setSenha(e.target.value)} className="border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"/>
                  <input type="password" placeholder="Confirmar senha *" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"/>
                  <input type="date" className="border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                  <input placeholder="CPF *" className="border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                  <input placeholder="Telefone *" className="border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                  <input placeholder="Cidade" className="border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                  <input placeholder="Bairro" className="border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />

                </div>
                <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-300 hover:border-green-400 rounded-xl p-4 text-center cursor-pointer transition-all mb-5">
                  <Upload size={22} className="mx-auto text-green-400 mb-1" />
                  <span className="text-sm text-muted-foreground font-semibold">Documento com foto (RG, CNH ou passaporte)</span>
                  <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" />
                </div>
                <div className="space-y-3 mb-6">
                  <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" className="accent-green-600 w-4 h-4 mt-0.5" /><span className="text-sm text-gray-700">Concordo com os <span className="text-green-600 font-semibold">Termos de Uso</span> e <span className="text-green-600 font-semibold">Política de Privacidade</span></span></label>
                  <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" className="accent-green-600 w-4 h-4 mt-0.5" /><span className="text-sm text-gray-700">Autorizo o uso dos meus dados para fins de processo de adoção</span></label>
                </div>
                <button onClick={cadastrar}
                 className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.01] shadow-xl shadow-green-200">
                  Criar Minha Conta
                </button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Já tem conta? <button onClick={() => navigate("login")} className="text-green-600 font-bold hover:text-green-800">Entrar</button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ───── CONTATO ───── */}
        {page === "contato" && (
          <div className="min-h-screen bg-background">
            <div className="bg-gradient-to-br from-green-800 to-green-950 text-white py-16 px-4 text-center">
              <h1 className="font-['Playfair_Display',serif] font-bold text-5xl mb-4">Entre em Contato</h1>
              <p className="text-green-200 text-xl">Estamos aqui para ajudar você e os animais</p>
            </div>
            <div className="max-w-5xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                {[
                  { icon: PhoneCall, l: "Telefone / WhatsApp", v: "(21) 99364-2230", c: "bg-green-100 text-green-700", href: "tel:+5521993642230" },
                  { icon: Mail, l: "Email", v: "sosvidaipm@gmail.com", c: "bg-blue-100 text-blue-700", href: "mailto:sosvidaipm@gmail.com" },
                  { icon: MapPin, l: "Localização", v: "Rio de Janeiro, RJ", c: "bg-red-100 text-red-700", href: undefined },
                  { icon: Clock, l: "Emergências", v: "24 horas, 7 dias por semana", c: "bg-orange-100 text-orange-700", href: undefined },
                ].map(c => (
                  <div key={c.l} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.c}`}><c.icon size={22} /></div>
                    <div>
                      <div className="text-xs text-muted-foreground font-semibold">{c.l}</div>
                      {c.href ? <a href={c.href} className="font-bold text-gray-800 hover:text-green-700 transition-colors">{c.v}</a> : <div className="font-bold text-gray-800">{c.v}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
                <h2 className="font-['Playfair_Display',serif] font-bold text-2xl text-gray-800 mb-5">Envie uma mensagem</h2>
                <div className="space-y-4">
                  <input placeholder="Seu nome" className="w-full border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                  <input placeholder="Email ou telefone" className="w-full border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                  <select className="w-full border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
                    <option>Assunto</option><option>Adoção</option><option>Resgate</option><option>Denúncia</option><option>Doação</option><option>Voluntariado</option><option>Outro</option>
                  </select>
                  <textarea rows={5} placeholder="Sua mensagem..." className="w-full border border-border rounded-xl px-4 py-3 bg-input-background focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none" />
                  <button onClick={() => showToast("Mensagem enviada! Responderemos em até 24h. 💚")} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.01] shadow-xl shadow-green-200 flex items-center justify-center gap-2">
                    <Send size={20} /> Enviar Mensagem
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───── BLOG ───── */}
        {page === "blog" && (
          <div className="min-h-screen bg-background">
            <div className="bg-gradient-to-br from-indigo-800 to-indigo-950 text-white py-16 px-4 text-center">
              <BookOpen size={48} className="mx-auto mb-4 opacity-80" />
              <h1 className="font-['Playfair_Display',serif] font-bold text-5xl mb-4">Blog da SOS Vida</h1>
              <p className="text-indigo-200 text-xl">Histórias de resgate, adoção e amor</p>
            </div>
            <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Thor encontrou seu lar eterno após 2 anos no abrigo", date: "22 Mai 2026", img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=250&fit=crop&auto=format", tag: "Adoção" },
                { title: "Campanha de castração atende 300 animais em uma semana", date: "18 Mai 2026", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=250&fit=crop&auto=format", tag: "Campanha" },
                { title: "Sagui resgatado é solto na Floresta da Tijuca", date: "15 Mai 2026", img: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&h=250&fit=crop&auto=format", tag: "Silvestre" },
                { title: "Como escolher a ração certa para o seu pet", date: "10 Mai 2026", img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop&auto=format", tag: "Dicas" },
                { title: "Feira de adoção reúne 50 famílias no Parque da Cidade", date: "5 Mai 2026", img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=250&fit=crop&auto=format", tag: "Evento" },
                { title: "Voluntários: conheça quem faz a diferença todos os dias", date: "1 Mai 2026", img: "https://images.unsplash.com/photo-1522543558187-768b6df7c25c?w=400&h=250&fit=crop&auto=format", tag: "Voluntários" },
              ].map(post => (
                <div key={post.title} className="bg-white rounded-3xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                  <div className="relative h-44 overflow-hidden">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">{post.tag}</span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold">{post.date}</p>
                    <h3 className="font-bold text-gray-800 leading-snug line-clamp-2 text-sm mb-3">{post.title}</h3>
                    <button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">Ler mais <ArrowRight size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 text-white pt-14 pb-8 px-4">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center"><PawPrint size={20} className="text-white" /></div>
              <span className="font-['Playfair_Display',serif] font-bold text-xl">SOS Vida</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">ONG dedicada ao resgate, tratamento e adoção responsável de animais no Rio de Janeiro desde 2012.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Navegação</h4>
            <div className="space-y-2">
              {NAV.map(n => <button key={n.page} onClick={() => navigate(n.page)} className="block text-gray-400 hover:text-green-400 text-sm font-medium transition-colors">{n.label}</button>)}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Mais</h4>
            <div className="space-y-2 text-sm">
              <button onClick={() => navigate("blog")} className="block text-gray-400 hover:text-green-400 transition-colors">Blog da ONG</button>
              <button onClick={() => navigate("login")} className="block text-gray-400 hover:text-green-400 transition-colors">Login</button>
              <button onClick={() => navigate("cadastro")} className="block text-gray-400 hover:text-green-400 transition-colors">Cadastro</button>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <div className="space-y-3">
              <a href="tel:+5521993642230" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-sm"><PhoneCall size={15} /> (21) 99364-2230</a>
              <a href="mailto:sosvidaipm@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-sm"><Mail size={15} /> sosvidaipm@gmail.com</a>
              <div className="flex items-center gap-2 text-gray-400 text-sm"><MapPin size={15} /> Rio de Janeiro, RJ</div>
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold"><Zap size={15} /> Emergências 24h</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© 2026 SOS Vida — Todos os direitos reservados</span>
          <div className="flex items-center gap-4">
            <span>Feito com 💚 para salvar vidas</span>
            <button onClick={() => navigate("admin")} className="text-gray-700 hover:text-green-400 transition-colors underline">Admin</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
