import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-neutral-dark dark:text-white min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row bg-white dark:bg-neutral-dark/50 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden min-h-[640px]">
        {/* Left Pane: Visual Storytelling */}
        <div className="relative w-full lg:w-1/2 bg-surface-light dark:bg-[#1a190b] flex flex-col justify-between p-8 lg:p-12 overflow-hidden group">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-105" data-alt="Drone delivering medical supplies box in rural landscape" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDy0rLT2bCiMsNzUQn7wQB3sh3iHEU5ZD8PhuwH6SlYTT1g76j7_Dz38pTyTscUqDtiJ4dZ9I2xPxL2bMTyi_W5Fp8PrRGzbd43N2zVTiFkFwh7h0mPt9EIFy_kzxwFgPZLGXAsK-PAZ4xZ2lVpKd9vbrkPnKO_n2lzOa_dbBwJx-YaMEoMgjb50zQpxPaY6Cy_nbpj7uKW3ANI3VdQLb2Z9_ub195dKH63RMrNSQMcct-K05qwR9ad5WX8eziLXZSW0Ft1OnL0cUo')" }}>
          </div>
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          {/* Top Brand Mark */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-text-main shadow-lg">
              <span className="material-symbols-outlined text-2xl text-neutral-dark">local_shipping</span>
            </div>
            <h2 className="text-white text-lg font-bold tracking-wide drop-shadow-md">StockHealth AI</h2>
          </div>
          {/* Bottom Content */}
          <div className="relative z-10 mt-auto max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              AI-for-Good Initiative
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 drop-shadow-lg">
              Ensuring essential supplies reach those in need.
            </h1>
            <p className="text-white/80 text-sm lg:text-base leading-relaxed">
              Prevent critical stock-outs and waste for government hospitals, PHCs, and disaster relief teams worldwide.
            </p>
          </div>
        </div>
        {/* Right Pane: Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 lg:p-16 relative bg-white dark:bg-[#23220f]">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-neutral-dark dark:text-white mb-2 tracking-tight">Secure Login</h2>
            <p className="text-neutral-gray dark:text-gray-400 text-base">
              Prevent stock-outs before they happen.
            </p>
          </div>
          <form className="flex flex-col gap-5">
            {/* Role Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-neutral-dark dark:text-gray-200 text-sm font-semibold ml-1">Select Role</label>
              <div className="relative rounded-xl transition-shadow duration-200 focus-within:ring-2 focus-within:ring-primary">
                <select className="w-full h-14 pl-4 pr-10 rounded-xl bg-background-light dark:bg-[#1a190b] border-transparent focus:border-transparent focus:ring-0 text-neutral-dark dark:text-white text-base appearance-none cursor-pointer">
                  <option disabled selected value="">Choose your access level</option>
                  <option value="hospital_manager">Hospital/PHC Manager</option>
                  <option value="procurement">Procurement Officer</option>
                  <option value="ngo_officer">NGO Field Officer</option>
                  <option value="admin">System Administrator</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-neutral-gray">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>
            {/* Email/Phone Input */}
            <div className="flex flex-col gap-2">
              <label className="text-neutral-dark dark:text-gray-200 text-sm font-semibold ml-1">Email or Phone Number</label>
              <div className="relative h-14 flex items-center bg-background-light dark:bg-[#1a190b] rounded-xl focus-within:ring-2 focus-within:ring-primary transition-shadow duration-200">
                <div className="pl-4 text-neutral-gray flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <input className="w-full h-full bg-transparent border-none focus:ring-0 text-neutral-dark dark:text-white placeholder-neutral-gray/70 px-4 text-base" placeholder="user@health.gov or +1 234..." type="text" />
              </div>
            </div>
            {/* Remember Me & Help */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input className="peer h-5 w-5 rounded border-2 border-background-light dark:border-gray-600 bg-background-light dark:bg-[#1a190b] text-neutral-dark checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer" type="checkbox" />
                  <span className="absolute text-black opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                    </svg>
                  </span>
                </div>
                <span className="text-neutral-dark dark:text-gray-300 text-sm font-medium group-hover:text-black dark:group-hover:text-white transition-colors">Remember device</span>
              </label>
              <a className="text-sm font-semibold text-neutral-dark dark:text-white hover:text-primary transition-colors underline decoration-2 decoration-primary/30 hover:decoration-primary" href="#">Need Help?</a>
            </div>
            {/* Main Action Button */}
            <Link href="/dashboard" className="w-full h-12 bg-primary hover:bg-[#e6e205] text-neutral-dark text-base font-bold rounded-full shadow-[0_4px_14px_0_rgba(249,245,6,0.39)] hover:shadow-[0_6px_20px_rgba(249,245,6,0.23)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 flex items-center justify-center gap-2 mt-2">
              <span>Send OTP</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </form>
          {/* Footer Meta */}
          <div className="mt-auto pt-8 flex flex-col items-center gap-4">
            <div className="w-full h-px bg-background-light dark:bg-gray-800"></div>
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 text-xs text-neutral-gray dark:text-gray-500">
              <div className="flex items-center gap-1.5 bg-background-light dark:bg-[#1a190b] px-3 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-sm text-green-600">lock</span>
                <span className="font-medium">Secure Connection | HIPAA Compliant</span>
              </div>
              <div className="flex gap-4 font-medium">
                <a className="hover:text-neutral-dark dark:hover:text-white transition-colors" href="#">Privacy</a>
                <a className="hover:text-neutral-dark dark:hover:text-white transition-colors" href="#">Terms</a>
                <a className="hover:text-neutral-dark dark:hover:text-white transition-colors" href="#">Contact Admin</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
